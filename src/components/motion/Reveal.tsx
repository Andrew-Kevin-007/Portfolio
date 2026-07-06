"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * Reveal v2 — content-first choreography.
 * Fast (0.6s), small travel (14px), NO blur (blur mid-flight reads as a bug,
 * and content must never lag the reader). Elements already in the viewport
 * at mount animate immediately; everything else on first intersection.
 * Tweens are killed on unmount; overwrite guards double-fires (StrictMode).
 */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      return;
    }

    const play = () => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay,
          ease: "expo.out",
          overwrite: "auto",
          clearProps: "transform",
        }
      );
    };

    // Already on screen (above the fold / fast navigation)? Don't make the
    // reader wait for an observer round-trip.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      play();
      return () => {
        gsap.killTweensOf(el);
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          play();
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      gsap.killTweensOf(el);
    };
  }, [delay, y]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} data-reveal className={className}>
      {children}
    </Tag>
  );
}
