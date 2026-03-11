import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";

export function ContactSection() {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bento-card glass relative max-w-3xl mx-auto overflow-hidden text-center"
        >          
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />

          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">
            Contato
          </p>

          <h2 className="text-4xl font-bold text-foreground mb-4">
            Vamos conversar?
          </h2>

          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Entre em
            contato para discutir seu próximo projeto.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="mailto:diegogontijo452@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-glow-purple px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Mail size={16} />
              diegogontijo452@gmail.com
            </a>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a
              href="#"
              className="p-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <Github size={20} />
            </a>

            <a
              href="#"
              className="p-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
            <MapPin size={14} />
            <span className="font-mono">Brasil</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}