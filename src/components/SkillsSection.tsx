import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";

const skills = [
  { name: "Docker", icon: "🐳", angle: 0 },
  { name: "Node.js", icon: "⬢", angle: 51 },
  { name: "Figma", icon: "◈", angle: 103 },
  { name: "Vercel", icon: "▲", angle: 154 },
  { name: "PostgreSQL", icon: "🐘", angle: 206 },
  { name: "Git", icon: "⎇", angle: 257 },
  { name: "React", icon: "⚛", angle: 309 },
];

export function SkillsSection() {
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      setRotation((prev) => (prev + delta * 0.008) % 360);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section id="skills" className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <BlurFade delay={0.1} inView>
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">
            Tech Stack
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            My <span className="glow-text">Skills</span>
          </h2>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <div className="relative w-[340px] h-[340px] md:w-[450px] md:h-[450px] mx-auto mt-16">
            {/* Orbital rings */}
            <div className="absolute inset-0 rounded-full border border-glow-purple/10 animate-pulse-glow" />
            <div className="absolute inset-6 rounded-full border border-glow-purple/8" />
            <div className="absolute inset-12 rounded-full border border-glow-purple/5" />

            {/* Wireframe sphere lines */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border border-glow-purple/[0.06]"
                style={{
                  transform: `rotateY(${i * 30}deg)`,
                  transformStyle: "preserve-3d",
                }}
              />
            ))}

            {/* Floating skill icons */}
            {skills.map((skill) => {
              const angle = ((skill.angle + rotation) * Math.PI) / 180;
              const radius = 42;
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);

              return (
                <motion.div
                  key={skill.name}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  <span className="text-2xl md:text-3xl">{skill.icon}</span>
                  <span className="text-[10px] tracking-wider text-muted-foreground uppercase font-medium">
                    {skill.name}
                  </span>
                </motion.div>
              );
            })}

            {/* Center glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-glow-purple/10 blur-xl" />
            </div>

            {/* Small dots scattered */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 + rotation * 0.5) * (Math.PI / 180);
              const r = 20 + (i % 3) * 15;
              return (
                <div
                  key={`dot-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-muted-foreground/30"
                  style={{
                    left: `${50 + r * Math.cos(a)}%`,
                    top: `${50 + r * Math.sin(a)}%`,
                  }}
                />
              );
            })}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
