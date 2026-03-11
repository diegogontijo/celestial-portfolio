import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import profileImg from "@/assets/profile.jpg";
import kickboxingImg from "@/assets/kickboxing.jpg";
import cracowImg from "@/assets/cracow.jpg";

const techIcons = [
  { name: "FIND", color: "hsl(270 60% 62%)" },
  { name: "DOCKER", color: "hsl(200 80% 55%)" },
  { name: "GIT", color: "hsl(10 80% 55%)" },
  { name: "NEXT.JS", color: "hsl(0 0% 80%)" },
  { name: "REACT", color: "hsl(200 80% 65%)" },
];

export function HeroSection() {
  return (
    <section id="home" className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
          {/* Name card */}
          <BlurFade delay={0.1} inView>
            <div className="glass-card-hover p-8 flex flex-col items-center justify-center text-center h-full min-h-[180px]">
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">
                PAWEŁ
                <br />
                SZOSTAK
              </h1>
              <p className="text-xs tracking-[0.3em] text-muted-foreground mt-3 uppercase">
                Fullstack Developer
              </p>
            </div>
          </BlurFade>

          {/* Info tabs card */}
          <BlurFade delay={0.2} inView>
            <div className="glass-card-hover p-6 md:col-span-2 h-full min-h-[180px]">
              <p className="text-xs tracking-[0.2em] text-glow-purple text-center mb-4 uppercase">
                Hover to read more
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { title: "SCIENCE CLUB", desc: "Active member of the GenAI Science Club at AGH. Currently training models and building AI tools." },
                  { title: "UNIVERSITY", desc: "Pursuing Computer Science & Intelligent Systems at AGH — ranked as Poland's #2 technical university." },
                  { title: "COMPETITIONS", desc: "3rd Place Winner at the Cassini Hackathon and Econverse Startup Competition." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-3 rounded-lg cursor-pointer group"
                  >
                    <p className="text-xs font-bold text-foreground tracking-wide">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </BlurFade>

          {/* Mindset card */}
          <BlurFade delay={0.3} inView>
            <div className="glass-card-hover p-6 h-full">
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">Mindset</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Building more than software.</strong> My passions provide the{" "}
                <strong className="text-foreground">discipline and focus</strong> I need to grow.
              </p>
              <div className="mt-4 rounded-lg overflow-hidden relative">
                <img src={kickboxingImg} alt="Kickboxing training" className="w-full h-32 object-cover rounded-lg" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded text-xs font-medium text-foreground tracking-wide">
                  KICKBOXING
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Mastering <strong className="text-foreground">body and mind</strong> is my path to{" "}
                <strong className="text-foreground">excellence</strong>.
              </p>
            </div>
          </BlurFade>

          {/* Profile photo */}
          <BlurFade delay={0.4} inView>
            <div className="glass-card overflow-hidden h-full min-h-[300px]">
              <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </BlurFade>

          {/* Craft card */}
          <BlurFade delay={0.5} inView>
            <div className="glass-card-hover p-6 h-full flex flex-col justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">Craft</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Building scalable <strong className="text-foreground">apps, websites, and automations</strong>.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  I understand what advantages modern tech can provide, helping me advise on the solutions a business actually needs.
                </p>
              </div>
              <div>
                <div className="flex flex-wrap gap-3 mt-4">
                  {techIcons.map((t) => (
                    <span key={t.name} className="text-[10px] tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                      {t.name}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Active Hackathon competitor & Science Club member. Feel free to invite me to collaborate.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="status-dot" />
                    <span className="text-xs text-muted-foreground">Open to collaboration & freelance</span>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Location card - spans below profile */}
          <BlurFade delay={0.6} inView>
            <div className="glass-card overflow-hidden relative h-full min-h-[120px]">
              <img src={cracowImg} alt="Cracow" className="w-full h-full object-cover absolute inset-0" />
              <div className="absolute inset-0 bg-background/50" />
              <div className="relative p-6 flex flex-col justify-end h-full">
                <h3 className="font-display text-xl font-bold text-foreground tracking-wide">CRACOW, POLAND</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">50.0647° N, 19.9450° E</p>
                <p className="text-xs text-glow-purple mt-0.5">~ GMT+1</p>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
