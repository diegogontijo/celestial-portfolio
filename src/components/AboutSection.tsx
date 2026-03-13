import { BlurFade } from "@/components/ui/blur-fade";
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/ui/terminal";

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

        {/* ── Terminal ── */}
        <BlurFade delay={0.25} inView>
          <div className="mt-12">
            <Terminal className="max-w-full" startOnView sequence>

              {/* Prompt inicial */}
              <TypingAnimation className="text-muted-foreground" duration={40}>
                $ whoami --education --experience
              </TypingAnimation>

              {/* ── Formação ── */}
              <AnimatedSpan className="mt-4">
                <span className="text-green-400 font-semibold">✔ Formação</span>
              </AnimatedSpan>

              <AnimatedSpan className="pl-4">
                <span className="text-muted-foreground">curso     </span>
                <span className="text-foreground">Ciência da Computação</span>
              </AnimatedSpan>

              <AnimatedSpan className="pl-4">
                <span className="text-muted-foreground">instituição  </span>
                <span className="text-foreground">Universidade de Brasília — UnB</span>
              </AnimatedSpan>

              <AnimatedSpan className="pl-4">
                <span className="text-muted-foreground">status    </span>
                <span className="text-yellow-400">em andamento</span>
              </AnimatedSpan>

              {/* ── Experiência ── */}
              <AnimatedSpan className="mt-4">
                <span className="text-green-400 font-semibold">✔ Experiência</span>
              </AnimatedSpan>

              <AnimatedSpan className="pl-4">
                <span className="text-muted-foreground">cargo     </span>
                <span className="text-foreground">Desenvolvedor</span>
              </AnimatedSpan>

              <AnimatedSpan className="pl-4">
                <span className="text-muted-foreground">empresa   </span>
                <span className="text-foreground">CJR — Empresa Júnior de TI da UnB</span>
              </AnimatedSpan>

              <AnimatedSpan className="pl-4">
                <span className="text-muted-foreground">período   </span>
                <span className="text-foreground">Nov 2024 — presente</span>
              </AnimatedSpan>

              <AnimatedSpan className="pl-4">
                <span className="text-muted-foreground">status    </span>
                <span className="text-green-400">ativo</span>
              </AnimatedSpan>

              {/* Prompt de encerramento */}
              <AnimatedSpan className="mt-4">
                <span className="text-primary">$</span>
                <span className="text-muted-foreground"> _</span>
              </AnimatedSpan>

            </Terminal>
          </div>
        </BlurFade>

      </div>
    </section>
  );
}
