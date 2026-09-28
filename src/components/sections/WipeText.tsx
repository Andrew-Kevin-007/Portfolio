"use client";

// edith's hover effect (the "Become a Catalyst" button, edith: components/ui/Button.tsx), painted onto text instead of a pill.
// Hovering the enclosing link wipes a gradient in edith's marble colours across the letters through a fractal-noise
// displacement. The glow's centre follows the pointer on a damped spring (the pointer's place across the whole row is mapped
// onto the word), fast movement stretches it and drags its hot spot behind the motion, and a slow drift keeps it alive at rest.
// Keyboard focus plays it centred; reduced motion makes it short and undistorted; touch devices never run it.
//
// How the gradient lands only on the letters (styles: .wipe-text in globals.css): once measured, the word is drawn in SVG on
// top of the real text, which stays in the page (selectable, read by assistive tech) with a transparent fill. The gradient is
// masked by the same SVG glyphs, so nothing behind the word is covered, whatever sits there (the page, or the marble).
// Until the baseline is measured, and without JS, the real text shows as usual.

import { useCallback, useEffect, useId, useRef } from "react";

/** edith's hover colours (lib/theme.ts hoverStops), sampled from its marble. */
const STOPS = ["#FEAF01", "#FF8301", "#FF3702", "#F70C5A", "#E803D1", "#CE3AAD"] as const;

// edith's physics, unchanged. Damping ratio 14 / (2 * sqrt(120)) = 0.64: the glow overshoots a touch, then settles.
const STIFFNESS = 120;
const DAMPING = 14;
/** How far fast movement pulls the hot spot back along the motion, in seconds of velocity. */
const SMEAR = 0.06;

/** gsap's power2.out, which edith's timings are written in. */
const power2Out = (t: number) => 1 - (1 - t) * (1 - t);

type Track = { set: (v: number) => void; from: number; to: number; duration: number; delay?: number };

/** Plays tracks together on one animation frame loop; returns a function that stops it where it is. */
function tween(tracks: Track[], onDone?: () => void) {
  const start = performance.now();
  let raf = requestAnimationFrame(function frame(now) {
    let running = false;
    for (const tr of tracks) {
      const t = Math.min(Math.max((now - start) / 1000 - (tr.delay ?? 0), 0) / tr.duration, 1);
      tr.set(tr.from + (tr.to - tr.from) * power2Out(t));
      if (t < 1) running = true;
    }
    if (running) raf = requestAnimationFrame(frame);
    else onDone?.();
  });
  return () => cancelAnimationFrame(raf);
}

type Sim = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; w: number; h: number; t: number; on: boolean };

const media = (q: string) => window.matchMedia(q).matches;

export function WipeText({ children }: { children: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const filterId = `wipe-filter-${uid}`;
  const gradId = `wipe-grad-${uid}`;
  const maskId = `wipe-mask-${uid}`;
  const root = useRef<HTMLSpanElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const baseText = useRef<SVGTextElement>(null);
  const maskText = useRef<SVGTextElement>(null);
  const fill = useRef<SVGRectElement>(null);
  const glow = useRef<SVGRadialGradientElement>(null);
  const displacement = useRef<SVGFEDisplacementMapElement>(null);
  const stopTween = useRef<(() => void) | null>(null);
  const sim = useRef<Sim>({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, w: 0, h: 0, t: 0, on: false });

  const draw = useCallback(() => {
    const s = sim.current;
    const g = glow.current;
    if (!g) return;
    const speed = Math.hypot(s.vx, s.vy);
    const r = s.w * (0.75 + Math.min(speed / 1500, 0.45));
    // keep the focal point inside the circle however fast the pointer moves
    const k = speed ? Math.min(1, (0.5 * r) / (speed * SMEAR)) : 0;
    g.setAttribute("cx", s.x.toFixed(1));
    g.setAttribute("cy", s.y.toFixed(1));
    g.setAttribute("fx", (s.x - s.vx * SMEAR * k).toFixed(1));
    g.setAttribute("fy", (s.y - s.vy * SMEAR * k).toFixed(1));
    g.setAttribute("r", r.toFixed(1));
  }, []);

  const step = useCallback(
    (_time: number, deltaMs: number) => {
      const s = sim.current;
      const dt = Math.min(deltaMs / 1000, 1 / 30);
      s.t += dt;
      const tx = s.tx + Math.sin(s.t * 1.3) * s.w * 0.04;
      const ty = s.ty + Math.cos(s.t * 1.1) * s.h * 0.08;
      s.vx += (STIFFNESS * (tx - s.x) - DAMPING * s.vx) * dt;
      s.vy += (STIFFNESS * (ty - s.y) - DAMPING * s.vy) * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      draw();
    },
    [draw],
  );

  // Place the SVG glyphs on the real text's baseline, and keep them there through font swaps and resizes.
  useEffect(() => {
    const el = root.current;
    const p = probe.current;
    if (!el || !p) return;
    const place = () => {
      const y = String(p.offsetTop);
      baseText.current?.setAttribute("y", y);
      maskText.current?.setAttribute("y", y);
      el.classList.add("is-ready");
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    void document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    const row = el?.closest("a");
    if (!el || !row) return;
    const rect = fill.current;
    const disp = displacement.current;
    if (!rect || !disp || !media("(hover: hover)")) return;

    const width = () => parseFloat(rect.getAttribute("width") || "0") || 0;
    const setWidth = (v: number) => rect.setAttribute("width", `${v.toFixed(2)}%`);
    const scale = () => parseFloat(disp.getAttribute("scale") || "0") || 0;
    const setScale = (v: number) => disp.setAttribute("scale", v.toFixed(2));

    // one physics step per frame, only while hovered or fading out
    let simRaf = 0;
    let last = 0;
    const loop = (now: number) => {
      simRaf = requestAnimationFrame(loop);
      step(now, last ? now - last : 1000 / 60);
      last = now;
    };
    const startSim = () => {
      if (sim.current.on) return;
      sim.current.on = true;
      last = 0;
      simRaf = requestAnimationFrame(loop);
    };
    const stopSim = () => {
      if (!sim.current.on) return;
      cancelAnimationFrame(simRaf);
      sim.current.on = false;
    };
    /** The pointer's place across the whole row, mapped onto the word, so moving along the row moves the glow along it. */
    const toWord = (e: PointerEvent) => {
      const r = row.getBoundingClientRect();
      const s = sim.current;
      return { x: ((e.clientX - r.left) / r.width) * s.w, y: ((e.clientY - r.top) / r.height) * s.h };
    };

    const enter = (at?: PointerEvent) => {
      const s = sim.current;
      s.w = el.offsetWidth;
      s.h = el.offsetHeight;
      const calm = media("(prefers-reduced-motion: reduce)");
      if (at && !calm) {
        const p = toWord(at);
        Object.assign(s, { x: p.x, y: p.y, tx: p.x, ty: p.y, vx: 0, vy: 0 });
        startSim();
      } else {
        Object.assign(s, { x: s.w / 2, y: s.h / 2, vx: 0, vy: 0 });
      }
      draw();
      const d = calm ? 0.25 : 1;
      stopTween.current?.();
      stopTween.current = tween([
        { set: setWidth, from: width(), to: 150, duration: d },
        { set: setScale, from: calm ? 0 : 150, to: calm ? 0 : 40, duration: d },
      ]);
    };
    const leave = () => {
      const calm = media("(prefers-reduced-motion: reduce)");
      stopTween.current?.();
      stopTween.current = tween(
        [
          { set: setWidth, from: width(), to: 0, duration: calm ? 0.25 : 1 },
          { set: setScale, from: scale(), to: 0, duration: calm ? 0.25 : 0.5, delay: calm ? 0 : 0.5 },
        ],
        stopSim,
      );
    };

    const onEnter = (e: PointerEvent) => e.pointerType !== "touch" && enter(e);
    const onMove = (e: PointerEvent) => {
      if (!sim.current.on) return;
      const p = toWord(e);
      sim.current.tx = p.x;
      sim.current.ty = p.y;
    };
    const onFocus = () => row.matches(":focus-visible") && enter();
    row.addEventListener("pointerenter", onEnter);
    row.addEventListener("pointermove", onMove);
    row.addEventListener("pointerleave", leave);
    row.addEventListener("focusin", onFocus);
    row.addEventListener("focusout", leave);
    return () => {
      row.removeEventListener("pointerenter", onEnter);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerleave", leave);
      row.removeEventListener("focusin", onFocus);
      row.removeEventListener("focusout", leave);
      stopTween.current?.();
      stopSim();
    };
  }, [draw, step]);

  return (
    <span ref={root} className="wipe-text">
      <span className="wipe-text__label">
        {children}
        <span ref={probe} className="wipe-text__probe" aria-hidden="true" />
      </span>
      <svg className="wipe-text__fx" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-30%" y="-80%" width="200%" height="260%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={4} result="noise" seed={5} />
            <feDisplacementMap ref={displacement} in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <radialGradient id={gradId} ref={glow} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1">
            {STOPS.map((color, i) => (
              <stop key={color} offset={`${(i / (STOPS.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </radialGradient>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
            <text ref={maskText} x="0" y="0" fill="#fff">
              {children}
            </text>
          </mask>
        </defs>
        <text ref={baseText} x="0" y="0" fill="currentColor">
          {children}
        </text>
        <g mask={`url(#${maskId})`}>
          <rect ref={fill} fill={`url(#${gradId})`} x="-25%" y="-20%" width="0" height="140%" style={{ filter: `url(#${filterId})` }} />
        </g>
      </svg>
    </span>
  );
}
