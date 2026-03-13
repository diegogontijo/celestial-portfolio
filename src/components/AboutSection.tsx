import { motion } from "framer-motion";
import {
  Code2,
  Layers,
  Server,
  Smartphone,
  Database,
  GitBranch,
  Coffee,
  Dumbbell,
  Music,
  Globe,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShineBorder } from "@/components/ui/shine-border";

// ─── Dados ────────────────────────────────────────────────────────────────────

const focusAreas = [
  {
    icon: Code2,
    label: "Front-end",
    description: "React, TypeScript, Tailwind",
  },
  {
    icon: Server,
    label: "Back-end",
    description: "Node.js, NestJS, REST & GraphQL",
  },
  {
    icon: Database,
    label: "Banco de Dados",
    description: "PostgreSQL, Prisma, Redis",
  },
  {
    icon: Smartphone,
    label: "Mobile",
    description: "React Native, Expo",
  },
  {
    icon: Layers,
    label: "Arquitetura",
    description: "Clean Code, Design Patterns",
  },
  {
    icon: GitBranch,
    label: "DevOps",
    description: "Docker, Git, CI/CD",
  },
];

const interests = [
  { icon: Coffee,   label: "Café & Código" },
  { icon: Dumbbell, label: "Kickboxing" },
  { icon: Music,    label: "Música" },
  { icon: Globe,    label: "Viagens" },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">

        {/* ── Cabeçalho ── */}
        <BlurFade delay={0.1} inView>
          <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Sobre Mim
          </p>
          <h2 className="text-center font-display text-4xl font-bold text-foreground md:text-5xl">
            Quem sou <span className="glow-text">eu?</span>
          </h2>
        </BlurFade>

        {/* ── Layout principal: texto + foto ── */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-center">

          {/* Coluna de texto */}
          <BlurFade delay={0.2} inView>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p className="text-lg text-foreground font-medium">
                Olá! Sou <span className="glow-text-blue font-semibold">Diego Gontijo</span>, desenvolvedor
                web full-stack apaixonado por criar experiências digitais modernas e escaláveis.
              </p>
              <p>
                Atuo com desenvolvimento web há alguns anos, construindo aplicações que vão desde
                interfaces ricas e responsivas até APIs robustas e sistemas de alta performance.
                Tenho especial interesse em arquitetura de software limpa e em tornar o código
                legível e sustentável a longo prazo.
              </p>
              <p>
                Quando não estou codando, você me encontra praticando kickboxing, explorando novos
                lugares ou simplesmente tomando um café enquanto leio sobre novas tecnologias.
              </p>

              {/* Interesses pessoais */}
              <div className="flex flex-wrap gap-3 pt-2">
                {interests.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                  >
                    <Icon size={12} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </BlurFade>

          {/* Foto / card visual */}
          <BlurFade delay={0.3} inView>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto w-full max-w-sm lg:max-w-none"
            >
              <div className="bento-card relative overflow-hidden aspect-[4/5] rounded-2xl">
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                <img
                  src="/perf.jpeg"
                  alt="Diego Gontijo"
                  className="h-full w-full object-cover object-center"
                />
                {/* Badge de status */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass-card flex items-center gap-2 rounded-xl px-4 py-2.5">
                    <span className="status-dot" />
                    <span className="text-xs font-mono text-foreground">
                      disponível para projetos
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </BlurFade>
        </div>

        {/* ── Cards de áreas de atuação ── */}
        <BlurFade delay={0.4} inView>
          <p className="mt-20 mb-3 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Especialidades
          </p>
          <h3 className="mb-10 text-center font-display text-2xl font-bold text-foreground md:text-3xl">
            O que eu <span className="glow-text">faço</span>
          </h3>
        </BlurFade>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area, i) => (
            <BlurFade key={area.label} delay={0.45 + i * 0.07} inView>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="glass-card-hover group relative overflow-hidden rounded-xl p-5"
              >
                {/* Glow sutil no hover */}
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, hsl(270 80% 70% / 0.07), transparent 70%)",
                  }}
                />

                <div className="mb-3 inline-flex items-center justify-center rounded-lg border border-border bg-muted/40 p-2.5 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <area.icon size={18} />
                </div>

                <h4 className="mb-1 font-display text-sm font-semibold text-foreground">
                  {area.label}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {area.description}
                </p>
              </motion.div>
            </BlurFade>
          ))}
        </div>

      </div>
    </section>
  );
}
