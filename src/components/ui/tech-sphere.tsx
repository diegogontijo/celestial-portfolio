import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const SKILLS = [
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "Node.js", slug: "nodedotjs", color: "339933" },
  { name: "Python", slug: "python", color: "3776AB" },
  { name: "C++", slug: "cplusplus", color: "00599C" },
  { name: "Docker", slug: "docker", color: "2496ED" },
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1" },
  { name: "Git", slug: "git", color: "F05032" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
  { name: "Prisma", slug: "prisma", color: "FFFFFF" },
  { name: "Vercel", slug: "vercel", color: "FFFFFF" },
  { name: "Figma", slug: "figma", color: "F24E1E" },
  { name: "Next.js", slug: "nextdotjs", color: "FFFFFF" },
  { name: "NestJS", slug: "nestjs", color: "F24E1E" },
  { name: "Tailwind", slug: "tailwindcss", color: "06B6D4" },
  { name: "GitHub", slug: "github", color: "FFFFFF" },
];

/** Minimum opacity for icons at the very back of the sphere. */
const MIN_OPACITY = 0.15;

/** Sphere radius used for icon placement. */
const SPHERE_RADIUS = 2.3;

function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      )
    );
  }
  return points;
}

function createSvgTexture(svgText: string, size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  const tex = new THREE.CanvasTexture(canvas);

  img.onload = () => {
    ctx.clearRect(0, 0, size, size);
    const pad = 32;
    ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
    tex.needsUpdate = true;
    URL.revokeObjectURL(url);
  };
  img.src = url;
  return tex;
}

function createFallbackTexture(label: string, color: string, size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = `#${color}`;
  ctx.font = "bold 80px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label.slice(0, 2).toUpperCase(), size / 2, size / 2);
  return new THREE.CanvasTexture(canvas);
}

// Preload all textures once
function useAllTextures() {
  const [textures, setTextures] = useState<Map<string, THREE.CanvasTexture>>(new Map());

  useEffect(() => {
    let cancelled = false;
    const map = new Map<string, THREE.CanvasTexture>();

    SKILLS.forEach((s) => {
      map.set(s.slug, createFallbackTexture(s.name, s.color));
    });
    setTextures(new Map(map));

    Promise.all(
      SKILLS.map(async (s) => {
        try {
          const res = await fetch(`https://cdn.simpleicons.org/${s.slug}/${s.color}`);
          if (!res.ok) throw new Error("not found");
          const svgText = await res.text();
          if (!cancelled) {
            map.set(s.slug, createSvgTexture(svgText));
          }
        } catch {
          // keep fallback
        }
      })
    ).then(() => {
      if (!cancelled) setTextures(new Map(map));
    });

    return () => { cancelled = true; };
  }, []);

  return textures;
}

/**
 * IconNode renders a single icon plane on the sphere surface.
 *
 * Depth-based dimming: every frame we read the icon's world Z position.
 * The camera sits at Z = 5.5 and looks toward Z = 0, so:
 *   - large positive Z  → icon is close to the camera  → fully opaque
 *   - large negative Z  → icon is at the back           → MIN_OPACITY
 *
 * We map worldZ from [-SPHERE_RADIUS, +SPHERE_RADIUS] to [MIN_OPACITY, 1].
 */
function IconNode({
  position,
  texture,
  groupRef,
}: {
  position: THREE.Vector3;
  texture: THREE.CanvasTexture;
  groupRef: React.RefObject<THREE.Group>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const orientation = useMemo(() => {
    const outward = position.clone().normalize();
    const worldUp = new THREE.Vector3(0, 1, 0);

    let right = new THREE.Vector3().crossVectors(worldUp, outward);
    if (right.lengthSq() < 1e-6) {
      right = new THREE.Vector3(1, 0, 0).cross(outward);
    }
    right.normalize();

    const up = new THREE.Vector3().crossVectors(outward, right).normalize();
    const basis = new THREE.Matrix4().makeBasis(right, up, outward);
    return new THREE.Quaternion().setFromRotationMatrix(basis);
  }, [position]);

  // Reusable vector — avoids per-frame allocation
  const _worldPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!meshRef.current || !matRef.current) return;

    // World position of this icon after the group has been rotated
    meshRef.current.getWorldPosition(_worldPos);

    // worldZ ranges from -SPHERE_RADIUS (back) to +SPHERE_RADIUS (front).
    // Normalise to [0, 1]: 0 = back, 1 = front.
    const t = (_worldPos.z + SPHERE_RADIUS) / (2 * SPHERE_RADIUS);

    // Map t to opacity: back → MIN_OPACITY, front → 1.0
    matRef.current.opacity = MIN_OPACITY + t * (1 - MIN_OPACITY);
  });

  return (
    <mesh ref={meshRef} position={position} quaternion={orientation} renderOrder={1}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        depthTest={false}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function WireframeSphere() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.06;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={ref}>
      <mesh renderOrder={0}>
        <sphereGeometry args={[2, 24, 24]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.07} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => fibonacciSphere(SKILLS.length, SPHERE_RADIUS), []);
  const textures = useAllTextures();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <>
      <WireframeSphere />
      <group ref={groupRef}>
        {SKILLS.map((skill, i) => {
          const tex = textures.get(skill.slug);
          if (!tex) return null;
          return (
            <IconNode
              key={skill.slug}
              position={positions[i]}
              texture={tex}
              groupRef={groupRef}
            />
          );
        })}
      </group>
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
    </>
  );
}

export function TechSphere({ className }: { className?: string }) {
  return (
    <div className={className ?? "w-full h-[400px] md:h-[500px]"}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
