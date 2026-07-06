"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * Subtle magnetic pull toward the cursor (≤4px) — fine pointers only.
 * Physics, not decoration: quick attract, springy release.
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

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "expo.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "expo.out" });

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const relX = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const relY = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      xTo(Math.max(-1, Math.min(1, relX)) * strength);
      yTo(Math.max(-1, Math.min(1, relY)) * strength);
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
