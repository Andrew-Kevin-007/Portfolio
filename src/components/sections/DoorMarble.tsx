"use client";

// edith's marble behind a door row, revealed on hover/focus (styles: .door-marble in globals.css). It is a child of the row's
// <a>, so it drives itself from the row's pointer and focus events. So the first hover is instant, everything is made ready
// before it: once the row is within a screen of the viewport and the browser is idle, the three.js chunk and textures load,
// the textures are uploaded and the shaders compiled, all while the panel is invisible. A hover before that boots it on the
// spot. The reveal starts part-way through, so veins are already there when it first shows. It draws only while the row is
// engaged, and keeps drawing through the fade-out so it dissolves in motion. Touch devices never load it; data saving loads it
// only on intent; reduced motion gets the still instead.

import { useEffect, useRef, useState } from "react";
import type { HeroMarble } from "@/lib/marble/HeroMarble";

type Mode = "off" | "live" | "still";

/** Matches the .door-marble fade-out in globals.css: the marble keeps moving until it is gone. */
const FADE_OUT_MS = 1100;
/** Seconds of the reveal played before it is first shown: long enough that veins are already lit on the first hover. */
const START_AT = 4;

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
      // hide it before the context goes: a lost WebGL canvas can paint white for a frame
      cv.style.visibility = "hidden";
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
          startAt: START_AT,
          raysScale: 0.25,
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

    const bootOnce = () => {
      if (booted) return;
      booted = true;
      void boot();
    };
    const engage = (on: boolean) => {
      engaged = on;
      if (on) bootOnce();
      sync();
    };

    // Ready it ahead of the first hover: when the row is within a screen of the viewport, in the browser's idle time.
    let idleHandle: number | undefined;
    const idle = typeof window.requestIdleCallback === "function";
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        idleHandle = idle
          ? window.requestIdleCallback(bootOnce, { timeout: 2000 })
          : window.setTimeout(bootOnce, 300);
      },
      { rootMargin: "100% 0px" }
    );
    if (!calm && !nav.connection?.saveData) near.observe(door);
    const onEnter = (e: PointerEvent) => e.pointerType !== "touch" && engage(true);
    const onLeave = () => engage(false);
    const onFocus = () => door.matches(":focus-visible") && engage(true);
    door.addEventListener("pointerenter", onEnter);
    door.addEventListener("pointerleave", onLeave);
    door.addEventListener("focusin", onFocus);
    door.addEventListener("focusout", onLeave);

    return () => {
      cancelled = true;
      near.disconnect();
      if (idleHandle !== undefined) {
        if (idle) window.cancelIdleCallback(idleHandle);
        else window.clearTimeout(idleHandle);
      }
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
