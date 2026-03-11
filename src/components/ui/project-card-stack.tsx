import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type StackImage = {
  src: string;
  alt: string;
};

type ProjectCardStackProps = {
  images: StackImage[];
  className?: string;
};

export function ProjectCardStack({
  images,
  className = "",
}: ProjectCardStackProps) {
  const [cards, setCards] = React.useState(images);

  const moveToEnd = React.useCallback(() => {
    setCards((prev) => [...prev.slice(1), prev[0]]);
  }, []);

  const moveToStart = React.useCallback(() => {
    setCards((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
  }, []);

  if (!cards.length) return null;

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div className="relative h-full w-full">
        <AnimatePresence initial={false}>
          {cards.slice(0, 3).map((card, i) => {
            const isFront = i === 0;

            return (
              <motion.div
                key={`${card.src}-${i}`}
                className="absolute inset-0 overflow-hidden rounded-xl border border-white/10 bg-black/10 shadow-2xl"
                animate={{
                  y: i * 10,
                  scale: 1 - i * 0.04,
                  rotate: i === 1 ? -2 : i === 2 ? 2 : 0,
                  opacity: 1,
                  zIndex: 30 - i,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                }}
                drag={isFront ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) moveToEnd();
                  if (info.offset.x > 60) moveToStart();
                }}
                whileHover={isFront ? { y: -4 } : {}}
              >
                <img
                  src={card.src}
                  alt={card.alt}
                  className="h-full w-full object-cover select-none"
                  draggable={false}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {cards.length > 1 && (
        <>
          <button
            type="button"
            onClick={moveToStart}
            className="absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/20 bg-black/35 p-2 text-white backdrop-blur-sm transition hover:bg-black/50"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={moveToEnd}
            className="absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/20 bg-black/35 p-2 text-white backdrop-blur-sm transition hover:bg-black/50"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 gap-2">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === 0 ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}