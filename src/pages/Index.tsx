import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";

const Index = () => {
  return (
    <div className="relative min-h-screen dot-pattern">
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <SkillsSection />

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © 2026 Paweł Szostak. Built with passion.
        </p>
      </footer>
    </div>
  );
};

export default Index;
