import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { ProjectCardStack } from "@/components/ui/project-card-stack";
import { Star } from "lucide-react";

import cube1 from "@/assets/project-cube.jpg";
import p1 from "@/assets/p1.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";

import tree1 from "@/assets/project-tree.jpg";


const projects = [
  {
    number: "01",
    type: "DESKTOP APP",
    name: "Sua Inflação",
    description:
      "Desktop application using computer vision to scan and solve Rubik's Cube in real-time.",
    tags: ["C++", "OPENCV", "CLUSTERING", "ALGORITHMS"],
    images: [
      { src: p1, alt: "screenshot 1" },
      { src: p3, alt: "screenshot 2" },
      { src: p4, alt: "screenshot 3" },
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
      { src: p5, alt: "Tree screenshot 1" },
      { src: p6, alt: "Tree screenshot 2" },
      { src: p7, alt: "Tree screenshot 3" },
    ],
    colorClass: "project-card-green",
    starred: false,
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
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
                  className={`${project.colorClass} relative min-h-[440px] overflow-hidden rounded-2xl p-6`}
                >
                  <p className="relative z-10 max-w-xs text-sm leading-relaxed text-foreground/90">
                    {project.description}
                  </p>

                  <div className="absolute bottom-7 left-4 right-4 top-24">
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