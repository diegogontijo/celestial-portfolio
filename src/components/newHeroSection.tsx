import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Letras do nome animadas individualmente
const NAME_FIRST = "DIEGO";
const NAME_LAST  = "GONTIJO";

const letterVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      delay: 0.05 * i,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const subtitleVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.75, duration: 0.6, ease: "easeOut" },
  },
};

const bioVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 1.0, duration: 0.6, ease: "easeOut" },
  },
};

// ─── Scroll indicator ─────────────────────────────────────────────────────────

function ScrollIndicator() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToAbout}
      aria-label="Rolar para a próxima seção"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.6 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group"
    >
      {/* Cápsula com bolinha deslizante */}
      <div className="relative w-[26px] h-[44px] rounded-full border border-muted-foreground/40 group-hover:border-primary/60 transition-colors overflow-hidden">
        <motion.div
          className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-primary"
          animate={{ y: [0, 20, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Label */}
      <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
        scroll
      </span>
    </motion.button>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: o nome sobe levemente ao rolar
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const nameY      = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Glow ambiente centrado */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[500px] w-[700px] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(ellipse, hsl(270 80% 70%) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Conteúdo central */}
      <motion.div
        style={{ y: nameY, opacity: nameOpacity }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        {/* ── Nome ── */}
        <div className="overflow-hidden leading-none mb-1">
          <motion.div
            className="flex justify-center"
            initial="hidden"
            animate="visible"
          >
            {NAME_FIRST.split("").map((char, i) => (
              <motion.span
                key={`first-${i}`}
                custom={i}
                variants={letterVariants}
                className="inline-block font-hero font-black uppercase text-foreground"
                style={{
                  fontSize: "clamp(4.5rem, 14vw, 13rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 0.9,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <div className="overflow-hidden leading-none">
          <motion.div
            className="flex justify-center"
            initial="hidden"
            animate="visible"
          >
            {NAME_LAST.split("").map((char, i) => (
              <motion.span
                key={`last-${i}`}
                custom={NAME_FIRST.length + i}
                variants={letterVariants}
                className="inline-block font-hero font-black uppercase"
                style={{
                  fontSize: "clamp(4.5rem, 14vw, 13rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 0.9,
                  // Sobrenome com o gradiente glow do design system
                  background:
                    "linear-gradient(90deg, hsl(270 80% 70%), hsl(330 80% 65%), hsl(0 0% 100% / 0.9), hsl(330 80% 65%), hsl(270 80% 70%))",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "text-shine 6s ease-in-out infinite",
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ── Subtítulo ── */}
        <motion.div
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 flex items-center gap-4"
        >
          <span className="h-px w-10 bg-muted-foreground/30" />
          <p className="font-mono text-sm tracking-[0.35em] uppercase text-muted-foreground">
            Desenvolvedor Full-Stack
          </p>
          <span className="h-px w-10 bg-muted-foreground/30" />
        </motion.div>

        {/* ── Bio ── */}
        <motion.p
          variants={bioVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-md text-sm text-muted-foreground leading-relaxed"
        >
          Apaixonado por construir experiências digitais modernas e escaláveis.
          Estudo Ciência da Computação na UnB e atuo na empresa júnior CJR,
          desenvolvendo projetos reais desde novembro de 2024.
        </motion.p>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <ScrollIndicator />
    </section>
  );
}
