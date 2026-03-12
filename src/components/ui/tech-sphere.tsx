import { useRef, useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const SKILLS = [
  { name: "React",       slug: "react",        color: "61DAFB" },
  { name: "TypeScript",  slug: "typescript",   color: "3178C6" },
  { name: "Node.js",     slug: "nodedotjs",    color: "339933" },
  { name: "Python",      slug: "python",       color: "3776AB" },
  { name: "C++",         slug: "cplusplus",    color: "00599C" },
  { name: "Docker",      slug: "docker",       color: "2496ED" },
  { name: "PostgreSQL",  slug: "postgresql",   color: "4169E1" },
  { name: "Git",         slug: "git",          color: "F05032" },
  { name: "JavaScript",  slug: "javascript",   color: "F7DF1E" },
  { name: "Prisma",      slug: "prisma",       color: "FFFFFF" },
  { name: "Vercel",      slug: "vercel",       color: "FFFFFF" },
  { name: "Figma",       slug: "figma",        color: "F24E1E" },
  { name: "Next.js",     slug: "nextdotjs",    color: "FFFFFF" },
  { name: "NestJS",      slug: "nestjs",       color: "F24E1E" },
  { name: "Tailwind",    slug: "tailwindcss",  color: "06B6D4" },
  { name: "GitHub",      slug: "github",       color: "FFFFFF" },
];

const SPHERE_RADIUS = 2.3;

const OPACITY_FRONT = 1.0;
const OPACITY_BACK  = 0.12;
const BRIGHT_FRONT  = 1.0;
const BRIGHT_BACK   = 0.25;

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
        Math.sin(theta) * r * radius,
      )
    );
  }
  return points;
}

function buildOrientation(localPos: THREE.Vector3): THREE.Quaternion {
  const outward = localPos.clone().normalize();
  const worldUp = new THREE.Vector3(0, 1, 0);
  let right = new THREE.Vector3().crossVectors(worldUp, outward);
  if (right.lengthSq() < 1e-6) right = new THREE.Vector3(1, 0, 0).cross(outward);
  right.normalize();
  const up = new THREE.Vector3().crossVectors(outward, right).normalize();
  const basis = new THREE.Matrix4().makeBasis(right, up, outward);
  return new THREE.Quaternion().setFromRotationMatrix(basis);
}

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

// ─── Texture loading ──────────────────────────────────────────────────────────

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

function useAllTextures() {
  const [textures, setTextures] = useState<Map<string, THREE.CanvasTexture>>(new Map());

  useEffect(() => {
    let cancelled = false;
    const map = new Map<string, THREE.CanvasTexture>();
    SKILLS.forEach((s) => map.set(s.slug, createFallbackTexture(s.name, s.color)));
    setTextures(new Map(map));

    Promise.all(
      SKILLS.map(async (s) => {
        try {
          const res = await fetch(`https://cdn.simpleicons.org/${s.slug}/${s.color}`);
          if (!res.ok) throw new Error("not found");
          const svgText = await res.text();
          if (!cancelled) map.set(s.slug, createSvgTexture(svgText));
        } catch { /* keep fallback */ }
      })
    ).then(() => { if (!cancelled) setTextures(new Map(map)); });

    return () => { cancelled = true; };
  }, []);

  return textures;
}

// ─── Tooltip label (HTML overlay) ────────────────────────────────────────────

interface TooltipState {
  name: string;
  x: number; // pixels from left of canvas
  y: number; // pixels from top of canvas
}

interface TooltipProps {
  tooltip: TooltipState | null;
}

function Tooltip({ tooltip }: TooltipProps) {
  if (!tooltip) return null;
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
      style={{ left: tooltip.x, top: tooltip.y - 10 }}
    >
      <span className="rounded-md bg-black/80 px-2.5 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm whitespace-nowrap">
        {tooltip.name}
      </span>
    </div>
  );
}

// ─── Raycaster-based hover detection inside the Canvas ───────────────────────

interface SceneProps {
  onHover: (state: TooltipState | null) => void;
}

function Scene({ onHover }: SceneProps) {
  const groupRef  = useRef<THREE.Group>(null);
  const meshRefs  = useRef<(THREE.Mesh | null)[]>([]);

  const localPositions = useMemo(() => fibonacciSphere(SKILLS.length, SPHERE_RADIUS), []);
  const orientations   = useMemo(() => localPositions.map(buildOrientation), [localPositions]);
  const textures       = useAllTextures();

  const _worldPos  = useMemo(() => new THREE.Vector3(), []);
  const _camDir    = useMemo(() => new THREE.Vector3(), []);
  const raycaster  = useMemo(() => new THREE.Raycaster(), []);
  const pointer    = useMemo(() => new THREE.Vector2(), []);

  const { gl, camera, size } = useThree();

  // Track mouse position in normalised device coordinates
  const onMouseMove = useCallback((e: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    pointer.x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
    pointer.y = -((e.clientY - rect.top)   / rect.height) * 2 + 1;
  }, [gl, pointer]);

  const onMouseLeave = useCallback(() => {
    pointer.set(Infinity, Infinity); // move pointer off-screen
    onHover(null);
  }, [pointer, onHover]);

  useEffect(() => {
    const el = gl.domElement;
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [gl, onMouseMove, onMouseLeave]);

  useFrame(({ camera: cam }, delta) => {
    // 1. Rotate the group
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }

    // 2. Depth dimming
    cam.getWorldDirection(_camDir);
    meshRefs.current.forEach((mesh) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mesh.getWorldPosition(_worldPos);
      const iconDir = _worldPos.clone().normalize();
      const dot = iconDir.dot(_camDir);
      const frontness = smoothstep((-dot + 1) / 2);
      mat.opacity = OPACITY_BACK + frontness * (OPACITY_FRONT - OPACITY_BACK);
      mat.color.setScalar(BRIGHT_BACK + frontness * (BRIGHT_FRONT - BRIGHT_BACK));
    });

    // 3. Raycast for hover — only test meshes that are on the front hemisphere
    if (pointer.x === Infinity) return;

    raycaster.setFromCamera(pointer, cam);
    const targets = meshRefs.current.filter(Boolean) as THREE.Mesh[];
    const hits = raycaster.intersectObjects(targets, false);

    if (hits.length > 0) {
      const hitMesh = hits[0].object as THREE.Mesh;
      const idx = meshRefs.current.indexOf(hitMesh);
      if (idx !== -1) {
        // Only show tooltip for front-hemisphere icons
        hitMesh.getWorldPosition(_worldPos);
        const iconDir = _worldPos.clone().normalize();
        const dot = iconDir.dot(_camDir);
        if (dot < 0) {
          // Icon is on the front hemisphere — project to screen space
          const projected = _worldPos.clone().project(camera);
          const x = (projected.x  *  0.5 + 0.5) * size.width;
          const y = (-projected.y * 0.5 + 0.5) * size.height;
          onHover({ name: SKILLS[idx].name, x, y });
          return;
        }
      }
    }
    onHover(null);
  });

  return (
    <>
      <WireframeSphere />
      <group ref={groupRef}>
        {SKILLS.map((skill, i) => {
          const tex = textures.get(skill.slug);
          if (!tex) return null;
          return (
            <mesh
              key={skill.slug}
              ref={(el) => { meshRefs.current[i] = el; }}
              position={localPositions[i]}
              quaternion={orientations[i]}
              renderOrder={1}
            >
              <planeGeometry args={[0.8, 0.8]} />
              <meshBasicMaterial
                map={tex}
                transparent
                depthTest={false}
                depthWrite={false}
                side={THREE.DoubleSide}
                color={new THREE.Color(1, 1, 1)}
              />
            </mesh>
          );
        })}
      </group>
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
    </>
  );
}

// ─── Wireframe shell ──────────────────────────────────────────────────────────

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
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.07}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function TechSphere({ className }: { className?: string }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  return (
    <div className={`relative ${className ?? "w-full h-[400px] md:h-[500px]"}`}>
      <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene onHover={setTooltip} />
        </Suspense>
      </Canvas>
      <Tooltip tooltip={tooltip} />
    </div>
  );
}
