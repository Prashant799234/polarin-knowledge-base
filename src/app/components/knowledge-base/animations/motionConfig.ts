// Single source of truth for all animation config

const mq =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

export const prefersReducedMotion: boolean = mq?.matches ?? false;

// Duration tokens (seconds)
export const DUR = {
  instant:  prefersReducedMotion ? 0 : 0.10,
  fast:     prefersReducedMotion ? 0 : 0.15,
  normal:   prefersReducedMotion ? 0 : 0.22,
  moderate: prefersReducedMotion ? 0 : 0.30,
  slow:     prefersReducedMotion ? 0 : 0.35,
} as const;

export const EASE = [0.4, 0, 0.2, 1] as [number, number, number, number];

// ── Page transition variants ─────────────────────────────────────────────────
export const PAGE_VARIANTS = {
  initial: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: prefersReducedMotion ? 0 : -4 },
};

// ── Reveal (scroll) variants ─────────────────────────────────────────────────
export const REVEAL_VARIANTS = {
  hidden:  { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
  visible: { opacity: 1, y: 0 },
};

export const revealTransition = (delay = 0) => ({
  duration: DUR.slow,
  ease:     EASE,
  delay:    prefersReducedMotion ? 0 : delay,
});

// ── Stagger container ────────────────────────────────────────────────────────
export const STAGGER = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.055,
      delayChildren:   prefersReducedMotion ? 0 : 0.04,
    },
  },
};

// ── Collapse (sidebar accordion) ─────────────────────────────────────────────
export const COLLAPSE_VARIANTS = {
  open:   { height: "auto", opacity: 1 },
  closed: { height: 0,      opacity: 0 },
};
