"use client";

// edith's marble behind a door row, revealed on hover/focus (styles: .door-marble in globals.css). It is a child of the row's
// <a>, so it drives itself from the row's pointer and focus events. Nothing is fetched until the first hover or keyboard focus:
// the three.js chunk and textures load on intent, so a visitor who never engages the row pays nothing, and touch devices never
// engage it at all. The reveal starts from black when the marble is created, which hides the short load. It draws while the
// row is engaged and keeps drawing through the fade-out, so it dissolves in motion instead of freezing. Reduced motion and data
// saving get the still instead.

import { useEffect, useRef, useState } from "react";
import type { HeroMarble } from "@/lib/marble/HeroMarble";

type Mode = "off" | "live" | "still";

/** Matches the .door-marble fade-out in globals.css: the marble keeps moving until it is gone. */
const FADE_OUT_MS = 1100;

export function DoorMarble({ base = "/marble" }: { base?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("off");

  useEffect(() => {
    const host = root.current;
    const door = host?.parentElement;
    const cv = canvas.current;
    if (!host || !door || !cv) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!nav.connection?.saveData;
    // `?marble=force` keeps the live effect on a device that would be handed the still (software WebGL in tests, for one).
    const force = new URLSearchParams(window.location.search).get("marble") === "force";

    let cancelled = false;
    let engaged = false;
    let booted = false;
    let marble: HeroMarble | undefined;
    let settle = 0;

    const sync = () => {
      if (!marble) return;
      window.clearTimeout(settle);
      if (engaged) marble.start();
      else settle = window.setTimeout(() => marble?.stop(), FADE_OUT_MS);
    };
    const fallBack = () => {
      marble?.dispose();
      marble = undefined;
      setMode("still");
    };
    const boot = async () => {
      if (calm) return setMode("still");
      const { HeroMarble } = await import("@/lib/marble/HeroMarble");
      if (cancelled) return;
      if (!HeroMarble.supported()) return setMode("still");
      try {
        const m = await HeroMarble.create({
          canvas: cv,
          host,
          base,
          onSlow: force ? undefined : fallBack,
          onLost: fallBack,
        });
        if (cancelled) return m.dispose();
        marble = m;
      } catch {
        return setMode("still");
      }
      marble.renderOnce();
      setMode("live");
      sync();
    };

    const engage = (on: boolean) => {
      engaged = on;
      if (on && !booted) {
        booted = true;
        void boot();
      }
      sync();
    };
    const onEnter = (e: PointerEvent) => e.pointerType !== "touch" && engage(true);
    const onLeave = () => engage(false);
    const onFocus = () => door.matches(":focus-visible") && engage(true);
    door.addEventListener("pointerenter", onEnter);
    door.addEventListener("pointerleave", onLeave);
    door.addEventListener("focusin", onFocus);
    door.addEventListener("focusout", onLeave);

    return () => {
      cancelled = true;
      window.clearTimeout(settle);
      door.removeEventListener("pointerenter", onEnter);
      door.removeEventListener("pointerleave", onLeave);
      door.removeEventListener("focusin", onFocus);
      door.removeEventListener("focusout", onLeave);
      marble?.dispose();
      marble = undefined;
    };
  }, [base]);

  return (
    <span ref={root} className="door-marble" data-mode={mode} aria-hidden="true">
      <canvas ref={canvas} className="door-marble__canvas" />
      {mode === "still" ? <img className="door-marble__still" src={`${base}/poster.webp`} alt="" decoding="async" /> : null}
    </span>
  );
}
