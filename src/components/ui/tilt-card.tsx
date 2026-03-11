import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ShineBorder } from "./shine-border";

const MAX_ROTATE = 5;

export function TiltCard() {
  const x = useMotionValue(0.5); // 0..1
  const y = useMotionValue(0.5); // 0..1

  const rotateY = useTransform(x, [0, 1], [-MAX_ROTATE, MAX_ROTATE]);
  const rotateX = useTransform(y, [0, 1], [MAX_ROTATE, -MAX_ROTATE]);

  useEffect(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    x.set(px);
    y.set(py);
  };

  const recenter = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      className="hidden lg:block"
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={recenter}
        className="bento-card p-2 overflow-hidden aspect-square max-w-md mx-auto will-change-transform"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          transition: "transform 0s", 
        }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="w-full h-full rounded-xl overflow-hidden">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <img
            src="/perf.jpeg"
            alt="Developer Avatar"
            className="w-full h-full object-cover"
            style={{ transform: "translateZ(40px)" }}
            />
        </div>
      </motion.div>
    </motion.div>
  );
}
