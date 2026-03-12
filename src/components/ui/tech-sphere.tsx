import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const SKILLS = [
  { name: "Git",         slug: "git",          color: "F05032" },
  { name: "Docker",      slug: "docker",       color: "2496ED" },
  { name: "Node.js",     slug: "nodedotjs",    color: "339933" },
  { name: "Python",      slug: "python",       color: "3776AB" },
  { name: "C++",         slug: "cplusplus",    color: "00599C" },
  { name: "TypeScript",  slug: "typescript",   color: "3178C6" },
  { name: "NestJS",      slug: "nestjs",       color: "F24E1E" },
  { name: "React",       slug: "react",        color: "61DAFB" },
  { name: "JavaScript",  slug: "javascript",   color: "F7DF1E" },
  { name: "Next.js",     slug: "nextdotjs",    color: "FFFFFF" },
  { name: "Prisma",      slug: "prisma",       color: "FFFFFF" },
  { name: "Tailwind",    slug: "tailwindcss",  color: "06B6D4" },
  { name: "Vercel",      slug: "vercel",       color: "FFFFFF" },
  { name: "Figma",       slug: "figma",        color: "F24E1E" },
  { name: "PostgreSQL",  slug: "postgresql",   color: "4169E1" },
  { name: "GitHub",      slug: "github",       color: "FFFFFF" },
];

const SPHERE_RADIUS = 2.3;

// ─── Opacity / brightness constants ──────────────────────────────────────────
// t = 1  → icon is directly in front of the camera (closest point on sphere)
// t = 0  → icon is directly behind  the camera (furthest point on sphere)
const OPACITY_FRONT = 1.0;
const OPACITY_BACK  = 0.12;
// Color multiplier applied to the material colour when icon is at the back
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

// smooth step: maps t ∈ [0,1] to a smooth curve
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

// ─── Scene ────────────────────────────────────────────────────────────────────

/**
 * Scene manages the rotating group and drives per-icon depth dimming.
 *
 * Strategy
 * --------
 * All icons live inside a single <group> that rotates every frame.
 * Each icon mesh is registered in a `meshRefs` array.
 *
 * In the shared useFrame callback we:
 *   1. Advance the group rotation (y-axis spin).
 *   2. For every icon mesh, call getWorldPosition() to obtain its current
 *      world-space position (Three.js always returns the up-to-date value
 *      because the scene graph matrices are updated before useFrame runs).
 *   3. Compute the dot product of the icon's world position (normalised)
 *      with the camera's forward direction.  Because the camera points from
 *      +Z toward the origin:
 *        dot  ≈ +1  →  icon is directly behind the sphere  (back)
 *        dot  ≈ -1  →  icon is directly in front of camera (front)
 *   4. Remap that dot product to a smooth [0,1] "frontness" value and apply
 *      it to both opacity and colour.
 *
 * Using a single useFrame for all icons is more efficient than one per icon
 * and avoids the ordering issues that caused the previous bugs.
 */
function Scene() {
  const groupRef  = useRef<THREE.Group>(null);
  const meshRefs  = useRef<(THREE.Mesh | null)[]>([]);

  const localPositions = useMemo(() => fibonacciSphere(SKILLS.length, SPHERE_RADIUS), []);
  const orientations   = useMemo(() => localPositions.map(buildOrientation), [localPositions]);
  const textures       = useAllTextures();

  // Reusable objects — allocated once, reused every frame
  const _worldPos = useMemo(() => new THREE.Vector3(), []);
  const _camDir   = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    // 1. Rotate the group
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }

    // 2. Camera forward direction (points from camera toward origin)
    camera.getWorldDirection(_camDir); // normalised, points INTO the scene

    // 3. Update each icon's opacity and colour
    meshRefs.current.forEach((mesh) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;

      // World position of this icon (updated automatically by Three.js)
      mesh.getWorldPosition(_worldPos);

      // Normalise the icon's world position to get its direction from origin.
      // dot(iconDir, camDir):
      //   +1 → icon is directly behind the sphere (same direction as camera looks)
      //   -1 → icon is directly in front (opposite to where camera looks)
      const iconDir = _worldPos.clone().normalize();
      const dot = iconDir.dot(_camDir); // range [-1, +1]

      // Convert to frontness: 1 = fully in front, 0 = fully behind
      // dot = -1 → frontness = 1 (front)
      // dot = +1 → frontness = 0 (back)
      const rawFrontness = (-dot + 1) / 2; // [0, 1]
      const frontness = smoothstep(rawFrontness);  // smooth curve

      // Apply opacity
      mat.opacity = OPACITY_BACK + frontness * (OPACITY_FRONT - OPACITY_BACK);

      // Apply brightness via colour (white = full brightness, dark grey = dim)
      const brightness = BRIGHT_BACK + frontness * (BRIGHT_FRONT - BRIGHT_BACK);
      mat.color.setScalar(brightness);
    });
  });

  return (
    <>
      {/* Wireframe sphere shell */}
      <WireframeSphere />

      {/* Icon group */}
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
  return (
    <div className={className ?? "w-full h-[400px] md:h-[500px]"}>
      <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
