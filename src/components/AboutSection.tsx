import { motion } from "framer-motion";
import { User, GraduationCap, Briefcase } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";

// ─── Dados dos três blocos ─────────────────────────────────────────────────────

const blocks = [
  {
    icon: User,
    label: "Sobre Mim",
    title: "Quem sou eu",
    content:
      "Sou Diego Gontijo, desenvolvedor full-stack apaixonado por construir experiências digitais modernas e escaláveis. Tenho especial interesse em arquitetura de software limpa, interfaces ricas e código sustentável a longo prazo.",
    delay: 0.2,
  },
  {
    icon: GraduationCap,
    label: "Formação",
    title: "Ciência da Computação",
    content:
      "Curso Ciência da Computação na Universidade de Brasília (UnB), uma das principais universidades do país na área de tecnologia.",
    detail: "Universidade de Brasília — UnB",
    delay: 0.32,
  },
  {
    icon: Briefcase,
    label: "Experiência",
    title: "Empresa Júnior CJR",
    content:
      "Atuo desde novembro de 2024 na CJR, empresa júnior de tecnologia da UnB, desenvolvendo projetos reais para clientes e aprimorando habilidades em ambiente profissional.",
    detail: "Nov 2024 — presente",
    delay: 0.44,
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* ── Cabeçalho ── */}
        <BlurFade delay={0.1} inView>
          <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Sobre Mim
          </p>
          <h2 className="text-center font-display text-4xl font-bold text-foreground md:text-5xl">
            Quem sou <span className="glow-text">eu?</span>
          </h2>
        </BlurFade>

        {/* ── Três blocos ── */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {blocks.map(({ icon: Icon, label, title, content, detail, delay }) => (
            <BlurFade key={label} delay={delay} inView>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="glass-card-hover group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6 h-full"
              >
                {/* Glow sutil no hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, hsl(270 80% 70% / 0.07), transparent 70%)",
                  }}
                />

                {/* Ícone */}
                <div className="inline-flex w-fit items-center justify-center rounded-lg border border-border bg-muted/40 p-2.5 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <Icon size={18} />
                </div>

                {/* Label de categoria */}
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                  {label}
                </p>

                {/* Título */}
                <h3 className="font-display text-lg font-bold text-foreground leading-snug -mt-2">
                  {title}
                </h3>

                {/* Conteúdo */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {content}
                </p>

                {/* Detalhe (data / instituição) */}
                {detail && (
                  <span className="mt-auto inline-flex w-fit items-center rounded-full border border-border px-3 py-1 text-[10px] font-mono tracking-wider text-muted-foreground">
                    {detail}
                  </span>
                )}
              </motion.div>
            </BlurFade>
          ))}
        </div>

      </div>
    </section>
  );
}
