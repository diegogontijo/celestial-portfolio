import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { ProjectCardStack } from "@/components/ui/project-card-stack";
import { Star } from "lucide-react";

import cube1 from "@/assets/project-cube.jpg";
// import cube2 from "@/assets/project-cube-2.jpg";
// import cube3 from "@/assets/project-cube-3.jpg";

import tree1 from "@/assets/project-tree.jpg";
// import tree2 from "@/assets/project-tree-2.jpg";
// import tree3 from "@/assets/project-tree-3.jpg";

const projects = [
  {
    number: "01",
    type: "DESKTOP APP",
    name: "Cube Solver",
    description:
      "Desktop application using computer vision to scan and solve Rubik's Cube in real-time.",
    tags: ["C++", "OPENCV", "CLUSTERING", "ALGORITHMS"],
    images: [
      { src: cube1, alt: "Cube Solver screenshot 1" },
      { src: tree1, alt: "Cube Solver screenshot 2" },
      { src: cube1, alt: "Cube Solver screenshot 3" },
    ],
    colorClass: "project-card-orange",
    starred: true,
  },
  {
    number: "02",
    type: "MOBILE APP",
    name: "Improvement Tree",
    description:
      "Full-stack mobile app with cloud server that gamifies personal development.",
    tags: ["REACT NATIVE", "EXPO", "JAVA", "SPRING BOOT"],
    images: [
      { src: tree1, alt: "Improvement Tree screenshot 1" },
      { src: tree1, alt: "Improvement Tree screenshot 2" },
      { src: tree1, alt: "Improvement Tree screenshot 3" },
    ],
    colorClass: "project-card-green",
    starred: false,
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <BlurFade delay={0.1} inView>
          <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Portfolio
          </p>

          <h2 className="text-center font-display text-4xl font-bold text-foreground md:text-5xl">
            Featured <span className="glow-text">Projects</span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
            A curated selection of projects that made me confident in building software.
          </p>
        </BlurFade>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project, i) => (
            <BlurFade key={project.name} delay={0.2 + i * 0.15} inView>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {project.number}
                  </span>
                  <span className="h-px w-8 bg-border" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {project.type}
                  </span>
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                    {project.name}
                  </h3>

                  {project.starred && (
                    <span className="flex items-center gap-1 rounded-full bg-glow-purple/20 px-2.5 py-1 text-xs text-glow-purple">
                      <Star size={12} fill="currentColor" />
                      Star
                    </span>
                  )}
                </div>

                <div
                  className={`${project.colorClass} relative min-h-[360px] overflow-hidden rounded-2xl p-6`}
                >
                  <p className="relative z-10 max-w-xs text-sm leading-relaxed text-foreground/90">
                    {project.description}
                  </p>

                  <div className="absolute bottom-4 left-4 right-4 top-24">
                    <ProjectCardStack images={project.images} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-[10px] tracking-wider text-muted-foreground"
                    >
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