import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const SKILLS = [
  { name: "React", slug: "react", color: "#61DAFB" },
  { name: "TypeScript", slug: "typescript", color: "#3178C6" },
  { name: "Node.js", slug: "nodedotjs", color: "#339933" },
  { name: "Python", slug: "python", color: "#3776AB" },
  { name: "Docker", slug: "docker", color: "#2496ED" },
  { name: "PostgreSQL", slug: "postgresql", color: "#4169E1" },
  { name: "Git", slug: "git", color: "#F05032" },
  { name: "CSS3", slug: "css3", color: "#1572B6" },
  { name: "JavaScript", slug: "javascript", color: "#F7DF1E" },
  { name: "Vercel", slug: "vercel", color: "#FFFFFF" },
  { name: "Figma", slug: "figma", color: "#F24E1E" },
  { name: "Next.js", slug: "nextdotjs", color: "#FFFFFF" },
  { name: "Tailwind", slug: "tailwindcss", color: "#06B6D4" },
  { name: "GitHub", slug: "github", color: "#FFFFFF" },
];

function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
  }
  return points;
}

function LogoSprite({ position, url, name, color }: { position: THREE.Vector3; url: string; name: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const texture = useLoader(THREE.TextureLoader, url);

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  const dist = position.length();
  const scale = hovered ? 0.55 : 0.4;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[scale, scale]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.1} />
      </mesh>
      {hovered && (
        <mesh position={[0, -0.35, 0]} quaternion={meshRef.current?.quaternion}>
          <planeGeometry args={[1, 0.2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
}

function WireframeSphere() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.08;
      ref.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <group ref={ref}>
      {/* Main wireframe sphere */}
      <mesh>
        <sphereGeometry args={[2, 24, 24]} />
        <meshBasicMaterial color="#1a1040" wireframe transparent opacity={0.3} />
      </mesh>
      {/* Subtle inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.95, 16, 16]} />
        <meshBasicMaterial color="#2a1a5e" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function IconCloud() {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => fibonacciSphere(SKILLS.length, 2.2), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {SKILLS.map((skill, i) => (
        <LogoSprite
          key={skill.slug}
          position={positions[i]}
          url={`https://cdn.simpleicons.org/${skill.slug}/${skill.color.replace("#", "")}`}
          name={skill.name}
          color={skill.color}
        />
      ))}
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <WireframeSphere />
      <IconCloud />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
    </>
  );
}

export function TechSphere({ className }: { className?: string }) {
  return (
    <div className={className ?? "w-full h-[400px] md:h-[500px]"}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]}>
        <SceneContent />
      </Canvas>
    </div>
  );
}
