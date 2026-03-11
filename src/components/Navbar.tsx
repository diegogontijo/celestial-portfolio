import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const navItems = ["Home", "About", "Projects", "Skills", "Other"];

export function Navbar() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (section: string) => {
    setActive(section);
    const id = section.toLowerCase();
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-2 transition-all duration-300 ${scrolled ? "top-2" : "top-4"}`}
    >
      {/* Logo */}
      <button className="glass-card p-2.5 rounded-full border-glass-border hover:border-glow-purple/40 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-foreground">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
        </svg>
      </button>

      {/* Nav links */}
      <nav className="nav-glass rounded-full px-1.5 py-1.5 flex items-center gap-0.5">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => scrollToSection(item)}
            className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
              active === item
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active === item && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{item}</span>
          </button>
        ))}
      </nav>

      {/* Book a Call */}
      <button className="nav-glass rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-foreground hover:border-glow-purple/40 transition-all duration-200 hover:shadow-[0_0_20px_hsl(270_80%_70%/0.15)]">
        <Calendar size={14} />
        Book a Call
      </button>
    </motion.header>
  );
}
