import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { Star } from "lucide-react";
import projectCubeImg from "@/assets/project-cube.jpg";
import projectTreeImg from "@/assets/project-tree.jpg";

const projects = [
  {
    number: "01",
    type: "DESKTOP APP",
    name: "Cube Solver",
    description: "Desktop application using computer vision to scan and solve Rubik's Cube in real-time.",
    tags: ["C++", "OPENCV", "CLUSTERING", "ALGORITHMS"],
    image: projectCubeImg,
    colorClass: "project-card-orange",
    starred: true,
  },
  {
    number: "02",
    type: "MOBILE APP",
    name: "Improvement Tree",
    description: "Full-stack mobile app with cloud server that gamifies personal development.",
    tags: ["REACT NATIVE", "EXPO", "JAVA", "SPRING BOOT"],
    image: projectTreeImg,
    colorClass: "project-card-green",
    starred: false,
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <BlurFade delay={0.1} inView>
          <p className="text-xs tracking-[0.3em] text-muted-foreground text-center uppercase mb-3">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center text-foreground">
            Featured <span className="glow-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-center mt-4 max-w-lg mx-auto">
            A curated selection of projects that made me confident in building software.
          </p>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {projects.map((project, i) => (
            <BlurFade key={project.name} delay={0.2 + i * 0.15} inView>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-muted-foreground font-mono">{project.number}</span>
                  <span className="w-8 h-px bg-border" />
                  <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{project.type}</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">{project.name}</h3>
                  {project.starred && (
                    <span className="flex items-center gap-1 bg-glow-purple/20 text-glow-purple text-xs px-2.5 py-1 rounded-full">
                      <Star size={12} fill="currentColor" /> Star
                    </span>
                  )}
                </div>
                <div className={`${project.colorClass} rounded-2xl p-6 overflow-hidden relative min-h-[320px]`}>
                  <p className="text-sm text-foreground/90 leading-relaxed max-w-xs relative z-10">
                    {project.description}
                  </p>
                  <div className="absolute bottom-4 left-4 right-4 top-auto">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="rounded-lg shadow-2xl w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] tracking-wider text-muted-foreground border border-border rounded-full px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
