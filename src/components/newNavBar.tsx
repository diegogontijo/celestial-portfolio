import { useState } from "react";
import { Menu, X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = ["início", "sobre", "projetos", "skills", "contato"];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const sectionMap: Record<string, string> = {
    "início": "hero",
    "sobre": "about",
    "projetos": "projects",
    "skills": "skills",
    "contato": "contact",
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <button onClick={() => scrollTo("hero")} className="text-xl font-bold text-gradient">
          <span className="glow-text">DG</span>
        </button>

        <div className="hidden md:flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2 py-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(sectionMap[item])}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <a
          href="mailto:contato@diegogontijo.dev"
          className="hidden md:flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 transition-colors"
        >
          <Calendar size={16} />
          contato
        </a>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(sectionMap[item])}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground text-left rounded-lg hover:bg-muted transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
