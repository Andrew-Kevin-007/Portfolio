"use client";

import { useRef, useEffect } from "react";

/**
 * Subtle magnetic pull toward the cursor (≤4px) — fine pointers only.
 * Physics, not decoration: quick attract, springy release. Plain CSS
 * transitions; the release overshoots once, like a spring letting go.
 */
export function Magnetic({
  children,
  strength = 4,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const relX = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const relY = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const x = Math.max(-1, Math.min(1, relX)) * strength;
      const y = Math.max(-1, Math.min(1, relY)) * strength;
      el.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
    };
    const leave = () => {
      el.style.transition = "transform 0.7s cubic-bezier(0.34, 1.8, 0.64, 1)";
      el.style.transform = "translate(0, 0)";
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
      el.style.transition = "";
      el.style.transform = "";
    };
  }, [strength]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
