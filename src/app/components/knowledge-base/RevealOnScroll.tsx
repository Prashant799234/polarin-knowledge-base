import { motion } from "motion/react";
import { REVEAL_VARIANTS, STAGGER, prefersReducedMotion, revealTransition } from "./animations/motionConfig";
import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
  /** Use 'div' (default) or 'section' */
  as?: "div" | "section";
}

/** Animate element into view once when it enters the viewport */
export function RevealOnScroll({ children, delay = 0, style }: RevealProps) {
  if (prefersReducedMotion) {
    return <div style={style}>{children}</div>;
  }
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={REVEAL_VARIANTS}
      transition={revealTransition(delay)}
      style={style}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  style?: CSSProperties;
  viewportMargin?: string;
}

/**
 * Stagger-reveals direct children.
 * Each child must use `motion.X` with `variants` that accept "hidden"/"visible".
 */
export function RevealGroup({ children, style, viewportMargin = "-30px" }: StaggerProps) {
  if (prefersReducedMotion) {
    return <div style={style}>{children}</div>;
  }
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      variants={STAGGER}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/** motion.div that can be used as stagger child inside RevealGroup */
export function RevealItem({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  if (prefersReducedMotion) {
    return <div style={style}>{children}</div>;
  }
  return (
    <motion.div variants={REVEAL_VARIANTS} style={style}>
      {children}
    </motion.div>
  );
}
