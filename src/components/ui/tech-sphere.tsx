import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

const SKILLS = [
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "Node.js", slug: "nodedotjs", color: "339933" },
  { name: "Python", slug: "python", color: "3776AB" },
  { name: "Docker", slug: "docker", color: "2496ED" },
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1" },
  { name: "Git", slug: "git", color: "F05032" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
  { name: "Vercel", slug: "vercel", color: "FFFFFF" },
  { name: "Figma", slug: "figma", color: "F24E1E" },
  { name: "Next.js", slug: "nextdotjs", color: "FFFFFF" },
  { name: "Tailwind", slug: "tailwindcss", color: "06B6D4" },
  { name: "GitHub", slug: "github", color: "FFFFFF" },
  { name: "CSS3", slug: "css3", color: "1572B6" },
];

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

function useSvgTexture(slug: string, color: string) {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const tex = new THREE.CanvasTexture(canvas);

    const url = `https://cdn.simpleicons.org/${slug}/${color}`;
    fetch(url)
      .then((res) => res.text())
      .then((svgText) => {
        const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext("2d")!;
          ctx.clearRect(0, 0, size, size);
          const pad = 40;
          ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
          tex.needsUpdate = true;
          URL.revokeObjectURL(blobUrl);
        };
        img.src = blobUrl;
      });

    return tex;
  }, [slug, color]);

  return texture;
}

function IconNode({
  position,
  name,
  slug,
  color,
}: {
  position: THREE.Vector3;
  name: string;
  slug: string;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useSvgTexture(slug, color);

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.45, 0.45]} />
      <meshBasicMaterial map={texture} transparent />
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
      <mesh>
        <sphereGeometry args={[2, 24, 24]} />
        <meshBasicMaterial color="#1a1040" wireframe transparent opacity={0.25} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.95, 16, 16]} />
        <meshBasicMaterial color="#2a1a5e" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function IconCloud() {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => fibonacciSphere(SKILLS.length, 2.3), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {SKILLS.map((skill, i) => (
        <IconNode
          key={skill.slug}
          position={positions[i]}
          name={skill.name}
          color={skill.color}
        />
      ))}
    </group>
  );
}

export function TechSphere({ className }: { className?: string }) {
  return (
    <div className={className ?? "w-full h-[400px] md:h-[500px]"}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <WireframeSphere />
          <IconCloud />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
      </Canvas>
    </div>
  );
}
