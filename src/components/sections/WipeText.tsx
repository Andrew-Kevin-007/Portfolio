"use client";

// edith's hover effect (the "Become a Catalyst" button, edith: components/ui/Button.tsx), painted onto text instead of a pill.
// Hovering the enclosing link wipes a gradient in edith's marble colours across the letters through a fractal-noise
// displacement. The glow's centre follows the pointer on a damped spring (the pointer's place across the whole row is mapped
// onto the word), fast movement stretches it and drags its hot spot behind the motion, and a slow drift keeps it alive at rest.
// Keyboard focus plays it centred; reduced motion makes it short and undistorted; touch devices never run it.
//
// How the gradient lands only on the letters (styles: .wipe-text in globals.css): at rest the word is the page's own text,
// untouched. While the effect is active the real text steps aside and the same word is drawn in SVG on the same baseline: a
// plain-colour layer with the gradient wiping over it, both inside ONE glyph mask, so the mask is applied once to the finished
// picture (no halo where two separately masked layers would overlap). The SVG word is calibrated to carry the same ink as the
// real text (see place()), which keeps the swap invisible and the letters from swelling on hover.

import { useCallback, useEffect, useId, useRef } from "react";

/** edith's hover colours (lib/theme.ts hoverStops), sampled from its marble. */
const STOPS = ["#FEAF01", "#FF8301", "#FF3702", "#F70C5A", "#E803D1", "#CE3AAD"] as const;

// edith's physics, unchanged. Damping ratio 14 / (2 * sqrt(120)) = 0.64: the glow overshoots a touch, then settles.
const STIFFNESS = 120;
const DAMPING = 14;
/** How far fast movement pulls the hot spot back along the motion, in seconds of velocity. */
const SMEAR = 0.06;

/** The text height (px) the distortion was tuned for: edith's 45px button, and the home page title. Smaller text gets a
 * proportionally gentler and finer wobble, so a body-sized word is not smeared out of shape. */
const REF_HEIGHT = 48;

/** Edge-coverage exponent that gives the SVG word the same ink as the real text in the light theme. Measured to hold within
 * 0.5 percent from 1x to 2x pixel density and for words from 20px to 30px; it is the usual text gamma. */
const LIGHT_TEXT_GAMMA = 2.4;

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
  const thinId = `wipe-thin-${uid}`;
  const maskText = useRef<SVGTextElement>(null);
  const thin = useRef<SVGFEFuncAElement>(null);
  const fill = useRef<SVGRectElement>(null);
  const glow = useRef<SVGRadialGradientElement>(null);
  const turbulence = useRef<SVGFETurbulenceElement>(null);
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

  // Put the SVG word exactly where the real text is. Vertically: on its baseline (fractional, so it holds at any zoom or pixel
  // density). Horizontally: the browser snaps the SVG's box to a whole pixel but places the real text at its exact fractional
  // spot (a word mid-line rarely starts on a pixel boundary), so the leftover is handed to the SVG text; without it the word
  // shifts by up to half a pixel when the effect starts.
  const place = useCallback(() => {
    const el = root.current;
    const p = probe.current;
    if (!el || !p) return;
    const box = el.getBoundingClientRect();
    maskText.current?.setAttribute("x", (box.left - Math.round(box.left)).toFixed(3));
    maskText.current?.setAttribute("y", (p.getBoundingClientRect().top - box.top).toFixed(2));
    // Dark text on a light page is drawn lighter by the browser than the same glyphs through a mask, so in the light theme the
    // mask's edge coverage is curved down to match. Light text on a dark page already matches, so it gets no curve.
    const light = document.documentElement.getAttribute("data-theme") === "light";
    thin.current?.setAttribute("exponent", light ? String(LIGHT_TEXT_GAMMA) : "1");
    el.classList.add("is-ready");
  }, []);

  // Keep it placed through font swaps and resizes.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    window.addEventListener("resize", place);
    void document.fonts?.ready.then(place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [place]);

  useEffect(() => {
    const el = root.current;
    const row = el?.closest("a");
    if (!el || !row) return;
    const rect = fill.current;
    const disp = displacement.current;
    const turb = turbulence.current;
    if (!rect || !disp || !turb || !media("(hover: hover)")) return;

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

    let hovering = false;
    const enter = (at?: PointerEvent) => {
      hovering = true;
      place(); // measure again at the moment it matters: the word may have moved since it was last placed
      el.classList.add("is-active");
      const s = sim.current;
      s.w = el.offsetWidth;
      s.h = el.offsetHeight;
      const size = Math.min(1, s.h / REF_HEIGHT);
      turb.setAttribute("baseFrequency", (0.035 / size).toFixed(4));
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
        { set: setScale, from: calm ? 0 : 150 * size, to: calm ? 0 : 40 * size, duration: d },
      ]);
    };
    const leave = () => {
      hovering = false;
      const calm = media("(prefers-reduced-motion: reduce)");
      stopTween.current?.();
      stopTween.current = tween(
        [
          { set: setWidth, from: width(), to: 0, duration: calm ? 0.25 : 1 },
          { set: setScale, from: scale(), to: 0, duration: calm ? 0.25 : 0.5, delay: calm ? 0 : 0.5 },
        ],
        () => {
          stopSim();
          if (!hovering) el.classList.remove("is-active");
        },
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
      el.classList.remove("is-active");
    };
  }, [draw, step, place]);

  return (
    <span ref={root} className="wipe-text">
      <span className="wipe-text__label">
        {children}
        <span ref={probe} className="wipe-text__probe" aria-hidden="true" />
      </span>
      <svg className="wipe-text__fx" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-30%" y="-80%" width="200%" height="260%">
            <feTurbulence ref={turbulence} type="fractalNoise" baseFrequency="0.035" numOctaves={4} result="noise" seed={5} />
            <feDisplacementMap ref={displacement} in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <radialGradient id={gradId} ref={glow} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1">
            {STOPS.map((color, i) => (
              <stop key={color} offset={`${(i / (STOPS.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </radialGradient>
          <filter id={thinId} x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncA ref={thin} type="gamma" amplitude="1" exponent="1" offset="0" />
            </feComponentTransfer>
          </filter>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
            <text ref={maskText} x="0" y="0" fill="#fff" style={{ filter: `url(#${thinId})` }}>
              {children}
            </text>
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <rect x="-50%" y="-50%" width="200%" height="200%" fill="currentColor" />
          <rect ref={fill} fill={`url(#${gradId})`} x="-25%" y="-20%" width="0" height="140%" style={{ filter: `url(#${filterId})` }} />
        </g>
      </svg>
    </span>
  );
}
