import { BlurFade } from "@/components/ui/blur-fade";
import { TechSphere } from "@/components/ui/tech-sphere";

export function SkillsSection() {
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
          <TechSphere className="w-full h-[400px] md:h-[500px] mt-8" />
        </BlurFade>
      </div>
    </section>
  );
}
