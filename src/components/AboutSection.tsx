import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";

// ─── Dados ────────────────────────────────────────────────────────────────────

const items = [
  {
    icon: GraduationCap,
    category: "Formação",
    title: "Ciência da Computação",
    institution: "Universidade de Brasília — UnB",
    period: "Em andamento",
    description:
      "Cursando Ciência da Computação na UnB, uma das principais universidades do país na área de tecnologia.",
    delay: 0.2,
  },
  {
    icon: Briefcase,
    category: "Experiência",
    title: "Desenvolvedor na CJR",
    institution: "Empresa Júnior de Tecnologia — UnB",
    period: "Nov 2024 — presente",
    description:
      "Atuo na CJR desenvolvendo projetos reais para clientes, colaborando em equipe e aprimorando habilidades em ambiente profissional.",
    delay: 0.35,
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="container mx-auto max-w-2xl">

        {/* ── Cabeçalho ── */}
        <BlurFade delay={0.1} inView>
          <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Trajetória
          </p>
          <h2 className="text-center font-display text-4xl font-bold text-foreground md:text-5xl">
            Formação &amp; <span className="glow-text">Experiência</span>
          </h2>
        </BlurFade>

        {/* ── Linha do tempo vertical ── */}
        <div className="relative mt-16">

          {/* Linha central */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

          <div className="flex flex-col gap-12">
            {items.map(({ icon: Icon, category, title, institution, period, description, delay }) => (
              <BlurFade key={title} delay={delay} inView>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex gap-6 pl-12"
                >
                  {/* Ícone / nó da linha */}
                  <div className="absolute left-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm">
                    <Icon size={16} />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex flex-col gap-2 pt-1.5">
                    {/* Categoria + período */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">
                        {category}
                      </span>
                      <span className="h-px w-4 bg-border" />
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {period}
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {title}
                    </h3>

                    {/* Instituição */}
                    <p className="text-sm font-medium text-muted-foreground">
                      {institution}
                    </p>

                    {/* Descrição */}
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                      {description}
                    </p>
                  </div>
                </motion.div>
              </BlurFade>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
