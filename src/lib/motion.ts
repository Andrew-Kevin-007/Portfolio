/**
 * Motion tokens — one easing family, four durations.
 * Everything on this site eases like it has mass.
 */

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DUR = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
  reveal: 1.0,
} as const;

export const GSAP_EASE = "expo.out";

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
