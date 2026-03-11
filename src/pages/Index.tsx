import { Navbar } from "@/components/newNavBar";
import { HeroSection } from "@/components/newHeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ContactSection } from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="relative min-h-screen dot-pattern">
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />

      {/* Footer */}
      <footer className="nav-glass py-12 px-4 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © 2026 Diego Gontijo.
        </p>
      </footer>
    </div>
  );
};

export default Index;
