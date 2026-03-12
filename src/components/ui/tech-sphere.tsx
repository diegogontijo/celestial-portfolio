import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ─── Data ─────────────────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

const SPHERE_RADIUS   = 2.3;
const ICON_SIZE       = 0.8;   // base plane size (world units)
const ICON_SIZE_HOVER = 0.96;  // 1.2× on hover
const ROTATION_SPEED  = 0.08;  // radians/s when idle
const LERP_SPEED      = 12;    // smoothing factor for scale / brightness lerp

// Depth dimming
const OPACITY_FRONT = 1.0;
const OPACITY_BACK  = 0.12;
const BRIGHT_FRONT  = 1.0;
const BRIGHT_BACK   = 0.25;

// Hover brightness boost (applied on top of depth dimming)
const HOVER_BRIGHT_BOOST = 0.35;

// ─── Math helpers ─────────────────────────────────────────────────────────────

function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = ga * i;
    pts.push(new THREE.Vector3(Math.cos(t) * r * radius, y * radius, Math.sin(t) * r * radius));
  }
  return pts;
}

function buildOrientation(p: THREE.Vector3): THREE.Quaternion {
  const out = p.clone().normalize();
  const up  = new THREE.Vector3(0, 1, 0);
  let right = new THREE.Vector3().crossVectors(up, out);
  if (right.lengthSq() < 1e-6) right = new THREE.Vector3(1, 0, 0).cross(out);
  right.normalize();
  const u = new THREE.Vector3().crossVectors(out, right).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, u, out));
}

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

// ─── Texture loading ──────────────────────────────────────────────────────────

function createSvgTexture(svgText: string, size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const img  = new Image();
  const tex  = new THREE.CanvasTexture(canvas);
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
  canvas.width = canvas.height = size;
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
          if (!res.ok) throw new Error();
          const svg = await res.text();
          if (!cancelled) map.set(s.slug, createSvgTexture(svg));
        } catch { /* keep fallback */ }
      })
    ).then(() => { if (!cancelled) setTextures(new Map(map)); });
    return () => { cancelled = true; };
  }, []);
  return textures;
}

// ─── Tooltip (HTML overlay) ───────────────────────────────────────────────────

interface TooltipState { name: string; x: number; y: number }

function Tooltip({ tooltip }: { tooltip: TooltipState | null }) {
  // We keep the last known name so the fade-out still shows the text
  const lastRef = useRef<string>("");
  if (tooltip) lastRef.current = tooltip.name;

  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2"
      style={{
        left: tooltip?.x ?? 0,
        // sit 18 px above the icon centre
        top:  (tooltip?.y ?? 0) - 18,
        transform: "translate(-50%, -100%)",
        opacity:    tooltip ? 1 : 0,
        transition: "opacity 200ms ease, top 120ms ease",
      }}
    >
      <span
        style={{
          display:       "inline-block",
          padding:       "4px 10px",
          borderRadius:  "8px",
          background:    "rgba(0,0,0,0.65)",
          backdropFilter:"blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border:        "1px solid rgba(255,255,255,0.12)",
          boxShadow:     "0 4px 16px rgba(0,0,0,0.4)",
          color:         "#fff",
          fontSize:      "11px",
          fontWeight:    600,
          letterSpacing: "0.04em",
          whiteSpace:    "nowrap",
          fontFamily:    "Inter, system-ui, sans-serif",
        }}
      >
        {lastRef.current}
      </span>
    </div>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

interface SceneProps {
  onHover: (state: TooltipState | null) => void;
}

function Scene({ onHover }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Per-icon animated state (no React state — mutated directly each frame)
  const hoverProgress = useRef<number[]>(new Array(SKILLS.length).fill(0));
  const hoveredIndex  = useRef<number>(-1);

  const localPositions = useMemo(() => fibonacciSphere(SKILLS.length, SPHERE_RADIUS), []);
  const orientations   = useMemo(() => localPositions.map(buildOrientation), [localPositions]);
  const textures       = useAllTextures();

  // Reusable Three.js objects
  const _worldPos = useMemo(() => new THREE.Vector3(), []);
  const _camDir   = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer   = useMemo(() => new THREE.Vector2(Infinity, Infinity), []);

  const { gl, camera, size } = useThree();

  // ── Mouse listeners ──────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    pointer.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    pointer.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
  }, [gl, pointer]);

  const onMouseLeave = useCallback(() => {
    pointer.set(Infinity, Infinity);
    onHover(null);
  }, [pointer, onHover]);

  useEffect(() => {
    const el = gl.domElement;
    el.style.cursor = "default";
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [gl, onMouseMove, onMouseLeave]);

  // ── Per-frame logic ───────────────────────────────────────────────────────
  useFrame(({ camera: cam }, delta) => {
    const dt = Math.min(delta, 0.05); // clamp for tab-switch spikes

    // 1. Rotate group — slow down when something is hovered
    if (groupRef.current) {
      const anyHovered = hoveredIndex.current !== -1;
      const speed = anyHovered ? ROTATION_SPEED * 0.15 : ROTATION_SPEED;
      groupRef.current.rotation.y += dt * speed;
    }

    // 2. Camera direction for depth dimming
    cam.getWorldDirection(_camDir);

    // 3. Raycast
    let newHoveredIdx = -1;
    if (pointer.x !== Infinity) {
      raycaster.setFromCamera(pointer, cam);
      const targets = meshRefs.current.filter(Boolean) as THREE.Mesh[];
      const hits = raycaster.intersectObjects(targets, false);
      if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh;
        const idx = meshRefs.current.indexOf(hitMesh);
        if (idx !== -1) {
          hitMesh.getWorldPosition(_worldPos);
          const dot = _worldPos.clone().normalize().dot(_camDir);
          if (dot < 0) newHoveredIdx = idx; // front hemisphere only
        }
      }
    }

    // Update cursor style
    gl.domElement.style.cursor = newHoveredIdx !== -1 ? "pointer" : "default";

    // Emit tooltip (only when hovered index changes to avoid spam)
    if (newHoveredIdx !== hoveredIndex.current) {
      hoveredIndex.current = newHoveredIdx;
      if (newHoveredIdx === -1) {
        onHover(null);
      }
      // Tooltip position is updated every frame below when hovered
    }

    // 4. Per-icon update
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;

      // World position
      mesh.getWorldPosition(_worldPos);

      // Depth dimming
      const dot = _worldPos.clone().normalize().dot(_camDir);
      const frontness = smoothstep((-dot + 1) / 2);
      const baseOpacity    = OPACITY_BACK + frontness * (OPACITY_FRONT - OPACITY_BACK);
      const baseBrightness = BRIGHT_BACK  + frontness * (BRIGHT_FRONT  - BRIGHT_BACK);

      // Hover progress lerp (0 = idle, 1 = fully hovered)
      const targetProgress = i === hoveredIndex.current ? 1 : 0;
      hoverProgress.current[i] = THREE.MathUtils.lerp(
        hoverProgress.current[i],
        targetProgress,
        1 - Math.exp(-LERP_SPEED * dt),
      );
      const hp = hoverProgress.current[i];

      // Scale: lerp between base size and hover size
      const scale = ICON_SIZE + (ICON_SIZE_HOVER - ICON_SIZE) * hp;
      mesh.scale.setScalar(scale / ICON_SIZE); // geometry is baked at ICON_SIZE

      // Brightness: add hover boost
      const brightness = Math.min(1, baseBrightness + HOVER_BRIGHT_BOOST * hp);
      mat.color.setScalar(brightness);

      // Opacity: slightly boost on hover too
      mat.opacity = Math.min(1, baseOpacity + 0.15 * hp);

      // Emit tooltip position every frame while hovered (so it tracks rotation)
      if (i === hoveredIndex.current && hp > 0.05) {
        const projected = _worldPos.clone().project(camera);
        const sx = ( projected.x * 0.5 + 0.5) * size.width;
        const sy = (-projected.y * 0.5 + 0.5) * size.height;
        onHover({ name: SKILLS[i].name, x: sx, y: sy });
      }
    });
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
              <planeGeometry args={[ICON_SIZE, ICON_SIZE]} />
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
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.07} depthWrite={false} />
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
