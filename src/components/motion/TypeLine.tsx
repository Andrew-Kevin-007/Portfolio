"use client";

import { useEffect, useState } from "react";

/**
 * Typewriter line with a blinking block caret — azumbrunnen's intro physics.
 * Types once, caret blinks through and lingers briefly, then bows out.
 * Reduced motion: full text instantly, no caret theater.
 */
export function TypeLine({
  text,
  speed = 52,
  startDelay = 400,
  className,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
}) {
  const [n, setN] = useState(0);
  const [caret, setCaret] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      setCaret(false);
      return;
    }
    let i = 0;
    const timers: number[] = [];
    const type = () => {
      i += 1;
      setN(i);
      if (i < text.length) {
        timers.push(window.setTimeout(type, speed + Math.random() * 34));
      } else {
        timers.push(window.setTimeout(() => setCaret(false), 2200));
      }
    };
    timers.push(window.setTimeout(type, startDelay));
    return () => timers.forEach(clearTimeout);
  }, [text, speed, startDelay]);

  return (
    <span className={className} aria-label={text} role="text">
      <span aria-hidden>{text.slice(0, n)}</span>
      <span
        aria-hidden
        className="type-caret"
        style={{ opacity: caret ? undefined : 0 }}
      >
        ▍
      </span>
    </span>
  );
}
