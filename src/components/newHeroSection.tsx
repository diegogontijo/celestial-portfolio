import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { TiltCard } from "./ui/tilt-card";

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">      
      <div className="container mx-auto px-4 sm:px-6 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
              <span className="text-sm font-mono text-muted-foreground">disponível para projetos</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4">
              <span className="text-foreground">DIEGO</span>
              <br />
              <span className="glow-text">GONTIJO</span>
            </h1>

            <p className="text-lg font-mono text-muted-foreground tracking-widest uppercase mb-8">
              Desenvolvedor Web
            </p>

            <p className="text-lg text-muted-foreground max-w-md mb-10 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Construindo experiências digitais modernas e escaláveis.
            </p>

            <div className="flex items-center gap-4">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                Entre em contato
                <ArrowDown size={16} />
              </a>
              <div className="flex items-center gap-3">
                <a href="#" className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                  <Github size={18} />
                </a>
                <a href="#" className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </motion.div>

          
          <TiltCard />
          
        </div>
      </div>
    </section>
  );
}
