import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right";
}

export function Reveal({ children, delay = 0, className = "", from = "bottom" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const initial = {
    opacity: 0,
    y: from === "bottom" ? 40 : 0,
    x: from === "left" ? -40 : from === "right" ? 40 : 0,
  };
  const animate = inView ? { opacity: 1, y: 0, x: 0 } : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 bg-primary" />
      <span className="label-caps text-primary">{children}</span>
    </div>
  );
}
