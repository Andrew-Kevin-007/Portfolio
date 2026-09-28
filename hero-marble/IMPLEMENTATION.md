# edith's hero marble in the portfolio home hero: implementation

Written for: a Claude Code terminal agent working in `D:\Portfolio-Main\Portfolio` (kevinandrew.tech), for Kevin.

**Goal.** Give the portfolio's home hero the same background as the hero of the edith site (https://edith-plum.vercel.app):
the animated marble, black stone whose veins in red, orange, gold and magenta reveal themselves and follow the pointer. It goes
behind the existing "Hey, I'm Kevin" content. Kevin asked for "that exact background".

**Scope.** One new library file, one new component, one block of CSS, seven assets, two small edits (`Hero.tsx`, `Nav.tsx`) and
two dependencies. Do not commit or push. Show Kevin the result first.

## 0. What has already been proven (so you do not redo it)

The code below was built and tested in a scratch project (Vite, React 19 in StrictMode, three 0.180.0, postprocessing 6.38.0,
TypeScript 5.9 strict). It has **not** been run inside this Next.js project yet, which is your job (section 5).

| Check | Result |
| --- | --- |
| Same image as live edith | 18 live edith frames against 61 frames of this port, 192 x 90 luminance, best match each: **mean correlation 0.84, best 0.97**. Controls: flipped upside down 0.16, mirrored 0.07, shifted 7 percent down 0.13, shifted 4 percent sideways 0.34. So the orientation is right and the position is within a few percent (a 4 percent shift already halves the score). |
| Same brightness and colour | Brightest 0.1 percent of pixels, median luminance 85.3 (port) against 83.7 (live). Bright pixel colour 165,76,56 against 166,77,79. Share of lit pixels 4.1 against 3.3 percent (the two were sampled at different moments of the reveal cycle, not adjusted). |
| Seamless on this site's `#0c0a09` | Without blending the hero's black is `0,0,0` against the page's `12,10,9`, a visible step. With `mix-blend-mode: screen` both are `12,10,9`, measured. |
| Behaviour (real browser, StrictMode) | 14 checks pass: goes live after mount; exactly one WebGL context despite the double mount; loop runs while the hero is visible, stops when scrolled away, resumes on return; unmount stops it; no console errors; reduced motion shows the still and never creates a context; no WebGL 2 shows the still; a slow device is handed the still; `?marble=force` overrides that. |
| Weight | Lazy chunk (three, postprocessing and this code) **497 KB, 126 KB gzip**, loaded after first paint. Textures 755 KB. The still 110 KB, downloaded only on the fallback path. |
| Not measured | Real GPU frame rate. The sandbox only had software WebGL (about 3 frames a second, which is what trips the slow-device fallback). Judge speed on a real machine and a real phone. |

## 1. Files in this kit

`D:\Portfolio-Main\Portfolio\hero-marble\`:

- `IMPLEMENTATION.md` (this file)
- `assets\` the seven images, ready to copy: `marble.jpg`, `mask-r.jpg`, `mask-g.jpg`, `mask-b.jpg`, `gradient.jpg`, `noise.jpg`, `poster.webp`
- `prepare-assets.cjs` regenerates the textures and the GLSL from edith's own files (section 4.3)

Reference, read only, on this machine (edith, `D:\page_content\web`): `lib/gl/objects/Marble.ts` (the effect), `lib/gl/theatre.ts`
(the tuned numbers that win over the defaults), `lib/gl/shaders.ts` (the GLSL), `components/sections/Hero.tsx`.

## 2. Rules for this repository

- Next 15.5 App Router, React 19, next-intl (`[locale]` routes), Tailwind 4, TypeScript strict, Lenis. Dark is the default theme;
  `[data-theme="light"]` swaps the tokens. Dark and light must both be checked.
- No en or em dashes (U+2013, U+2014) in anything. British spelling. No new visible text is needed.
- Do not change copy, `content/`, `messages/`, routes or any section other than the hero. Do not touch the archived studio code.
- Add only the two dependencies named in 4.1, at the exact versions (no caret): they are the versions edith runs.
- `npm run typecheck` and `npm run build` must pass.
- **This repository already has uncommitted work that is not part of this task** (at the time of writing: `src/app/globals.css`,
  `src/components/sections/Doors.tsx` and a new `src/components/sections/DoorFilm.tsx`). Do not revert, stash, reformat or commit
  it. Appending your CSS to `globals.css` alongside it is expected. Run `git status` first and again at the end, and report any
  file you changed beyond the ones named here.

## 3. Design decisions (already made)

1. **Background only.** edith's marble also scrolls into a card in a later section. That is left out; here it is a background.
2. **A standalone renderer, not edith's whole WebGL engine.** The engine is about 2,700 lines built around DOM trackers and a
   page-wide canvas. The marble needs one canvas, one full-screen pass and one small light-ray pass, so that is what this is.
   The GLSL is copied verbatim; the numbers are edith's live values (`theatre.ts`), not the defaults written in `Marble.ts`.
3. **The hero becomes a `scene-dark`.** The portfolio already has this token scope (`globals.css`, "Apple contrast grammar"): the
   section is dark in both themes, so the marble never sits on the light page. In light mode the hero ends in a hard cut, which
   is that page's own grammar.
4. **`mix-blend-mode: screen`** on the canvas turns its black into the page's exact `#0c0a09` (see section 0).
5. **The header** needs the dark palette while it is over the hero, or in light mode its dark text vanishes on the marble.
6. **Fallback ladder.** Live marble, else a still image: for reduced motion, data saving, no WebGL 2, a slow device (median frame
   over 45 ms across frames 30 to 120), or a lost context. The three.js chunk loads after first paint, in an idle callback,
   so the server-rendered headline is never waiting on it. Drawing pauses when the hero is off screen or the tab is hidden.
7. **The reveal starts black and plays in,** as on edith. Do not add a fade of your own.

## 4. Steps

### 4.1 Dependencies

```
npm i three@0.180.0 postprocessing@6.38.0 --save-exact
npm i -D @types/three@0.180.0 --save-exact
```

### 4.2 Assets

Copy everything in `hero-marble\assets\` to `public\marble\`.

### 4.3 The GLSL (and, if you ever need them again, the textures)

`src/lib/marble/shaders.ts` must be created by this script, not typed: it copies the shaders verbatim from edith. The script is
already in the kit as `hero-marble\prepare-assets.cjs`. Run it once:

```
node hero-marble/prepare-assets.cjs D:/page_content/web D:/Portfolio-Main/Portfolio
```

It writes `src/lib/marble/shaders.ts` and rewrites the six textures in `public/marble/` (same content as the kit's copies).

```js
// Builds the marble's textures and shader file for another project from edith's own files.
//   node prepare-assets.cjs <edith web folder> <target project folder>
// Needs `sharp` (edith's node_modules has it; pass NODE_PATH or run from a folder that resolves it).
const fs = require("fs");
const path = require("path");
const [, , EDITH, TARGET] = process.argv;
if (!EDITH || !TARGET) throw new Error("usage: node prepare-assets.cjs <edith web folder> <target project folder>");
const sharp = require(path.join(EDITH, "node_modules", "sharp"));

const img = (p) => path.join(EDITH, "public", "gl", "images", p);
const out = (p) => path.join(TARGET, "public", "marble", p);
fs.mkdirSync(path.dirname(out("x")), { recursive: true });

(async () => {
  // Same sizes edith serves (its KTX2 files: marble 3072x2048, masks 1024x679), same aspect as the sources.
  await sharp(img("hero/marble.jpg")).resize(3072, 2048, { fit: "fill" }).jpeg({ quality: 88, mozjpeg: true }).toFile(out("marble.jpg"));
  for (const [src, name] of [["marble-01", "mask-r"], ["marble-02", "mask-g"], ["marble-03", "mask-b"]]) {
    await sharp(img(`hero/${src}.jpg`)).resize(1024, 679, { fit: "fill" }).jpeg({ quality: 90, mozjpeg: true }).toFile(out(`${name}.jpg`));
  }
  fs.copyFileSync(img("hero/colorA.jpg"), out("gradient.jpg"));
  fs.copyFileSync(img("misc/noise.jpg"), out("noise.jpg"));

  // The GLSL, taken verbatim from edith's shaders.ts: the helper chunks, then the fullscreen vertex, marble and rays shaders.
  const src = fs.readFileSync(path.join(EDITH, "lib", "gl", "shaders.ts"), "utf8");
  const helpers = src.slice(0, src.indexOf("export const gradientVertex"));
  const marble = src.slice(src.indexOf("export const fullscreenVertex"));
  fs.mkdirSync(path.join(TARGET, "src", "lib", "marble"), { recursive: true });
  fs.writeFileSync(
    path.join(TARGET, "src", "lib", "marble", "shaders.ts"),
    "// GLSL of the edith hero marble, copied verbatim from edith's lib/gl/shaders.ts. Do not edit; re-run prepare-assets to refresh.\n\n" + helpers + "\n" + marble,
  );
  for (const f of fs.readdirSync(path.join(TARGET, "public", "marble"))) console.log(f, fs.statSync(out(f)).size);
})();
```

### 4.4 `src/lib/marble/HeroMarble.ts` (new)

```ts
// The edith hero marble as a standalone background: one canvas, one full-screen shader pass, plus a small light-ray pass that
// follows the pointer. The look and every tuned number are edith's (lib/gl/objects/Marble.ts, with the values that win in
// lib/gl/theatre.ts). What is left out on purpose: the scroll morph into a card, the shared WebGL engine and the DOM trackers.

import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MirroredRepeatWrapping,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { GaussianBlurPass } from "postprocessing";
import { fullscreenVertex, marbleFragment, raysFragment } from "./shaders";

/** edith's live values: the overrides in lib/gl/theatre.ts ("Marble / Basic", "Marble / Rays"), not the defaults in Marble.ts. */
const TUNED = {
  boostFactor: 80,
  boostReveal: 30,
  timeFactorReveal: 0.30379746835443067,
  timeFactorBoost: 1,
  mouseProps: [0.2, 1, 30] as const,
  saturation: 3.4886075949367084,
  rays: { intensity: 10, offsetScale: 0.7278481012658236, decayRate: 0.6392405063291142, mixFactor: 0.22911392405063305, clampMax: 1 },
};

/** The reveal runs at twice the speed at first and eases down to normal over this long (edith: gsap power1.inOut, 8 s). */
const INTRO_SECONDS = 8;
const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));

const triangle = new BufferGeometry();
triangle.setAttribute("uv", new BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));
triangle.setAttribute("position", new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));

export type HeroMarbleOptions = {
  canvas: HTMLCanvasElement;
  /** The box whose size the canvas follows (the hero section). */
  host: HTMLElement;
  /** Where marble.jpg, mask-r.jpg, mask-g.jpg, mask-b.jpg, gradient.jpg and noise.jpg are served from. */
  base?: string;
  /** Seconds of the reveal already played. For a still image and for tests. */
  startAt?: number;
  /** Called once if the first seconds run too slowly for the effect to be worth it (the caller then falls back to the still). */
  onSlow?: () => void;
  /** Called if the browser drops the WebGL context. */
  onLost?: () => void;
};

export class HeroMarble {
  static supported(): boolean {
    try {
      const c = document.createElement("canvas");
      const ok = !!c.getContext("webgl2");
      c.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
      return ok;
    } catch {
      return false;
    }
  }

  static async create(options: HeroMarbleOptions): Promise<HeroMarble> {
    const base = options.base ?? "/marble";
    const loader = new TextureLoader();
    const [marble, gradient, maskR, maskG, maskB, noise] = await Promise.all(
      ["marble.jpg", "gradient.jpg", "mask-r.jpg", "mask-g.jpg", "mask-b.jpg", "noise.jpg"].map((f) => loader.loadAsync(`${base}/${f}`)),
    );
    marble.colorSpace = SRGBColorSpace;
    gradient.colorSpace = SRGBColorSpace;
    gradient.wrapS = gradient.wrapT = MirroredRepeatWrapping;
    noise.wrapS = noise.wrapT = MirroredRepeatWrapping;
    return new HeroMarble(options, { marble, gradient, maskR, maskG, maskB, noise });
  }

  #o: HeroMarbleOptions;
  #gl: WebGLRenderer;
  #camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  #scene = new Scene();
  #marbleMesh: Mesh;
  #raysMesh: Mesh;
  #marbleMat: ShaderMaterial;
  #raysMat: ShaderMaterial;
  #loop: WebGLRenderTarget;
  #blurred: WebGLRenderTarget;
  #blur: GaussianBlurPass;
  #textures: { dispose(): void }[];
  #dpr = 1;
  #mouse = { value: new Vector2(0, 0) }; // smoothed pointer, -1..1 (shared by both shaders)
  #mouseTarget = new Vector2(0, 0);
  #time = { value: 0 };
  #raf = 0;
  #last = 0;
  #frames = 0;
  #run = 0; // seconds spent running, drives the intro speed-up
  #dts: number[] = [];
  #slowReported = false;
  #resizeObserver: ResizeObserver;

  private constructor(options: HeroMarbleOptions, t: Record<"marble" | "gradient" | "maskR" | "maskG" | "maskB" | "noise", import("three").Texture>) {
    this.#o = options;
    this.#dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
    this.#gl = new WebGLRenderer({ canvas: options.canvas, powerPreference: "high-performance", antialias: false, alpha: false });
    this.#gl.setClearColor(0x000000);
    this.#gl.setPixelRatio(this.#dpr);
    options.canvas.addEventListener("webglcontextlost", this.#onContextLost);

    // Light rays: the marble smeared radially around the pointer, drawn at half size and blurred (edith does the same).
    const w = t.marble.image.width * 0.5;
    const h = t.marble.image.height * 0.5;
    const rt = { depthBuffer: false, stencilBuffer: false };
    this.#loop = new WebGLRenderTarget(w, h, rt);
    this.#blurred = new WebGLRenderTarget(w, h, rt);
    this.#blur = new GaussianBlurPass({ kernelSize: 6, resolutionScale: 1, iterations: 2 });
    this.#blur.setSize(w, h);

    const r = TUNED.rays;
    this.#raysMat = new ShaderMaterial({
      vertexShader: fullscreenVertex,
      fragmentShader: raysFragment,
      uniforms: {
        uTxt: { value: t.marble },
        uMouse: this.#mouse,
        uNoise: { value: t.noise },
        uTime: this.#time,
        uIntensity: { value: r.intensity },
        uOffsetScale: { value: r.offsetScale },
        uDecayRate: { value: r.decayRate },
        uMixFactor: { value: r.mixFactor },
        uClampMax: { value: r.clampMax },
      },
    });

    this.#marbleMat = new ShaderMaterial({
      vertexShader: fullscreenVertex,
      fragmentShader: marbleFragment,
      uniforms: {
        uScrollProgress: { value: 0 },
        uAlpha: { value: 1 },
        uExpand: { value: 0 },
        uDim: { value: 1 },
        vUvScale: { value: 1 },
        uTxt: { value: t.marble },
        uTxtMask: { value: t.maskR },
        uTxtLoop: { value: this.#blurred.texture },
        uMaskSelection: { value: t.maskG },
        uMaskTime: { value: t.maskB },
        uNoiseTxt: { value: t.noise },
        uGradientTxt: { value: t.gradient },
        uBoostReveal: { value: TUNED.boostReveal },
        uBoostFactor: { value: TUNED.boostFactor },
        uPlane: { value: new Vector2() },
        uTime: { value: new Vector3() }, // reveal, boost, elapsed
        uMouse: this.#mouse,
        uMouseProps: { value: new Vector3(...TUNED.mouseProps) },
        uResolution: { value: new Vector3() },
        uSaturation: { value: TUNED.saturation },
      },
      transparent: true,
      depthWrite: false,
    });

    this.#marbleMesh = new Mesh(triangle, this.#marbleMat);
    this.#raysMesh = new Mesh(triangle, this.#raysMat);
    this.#marbleMesh.frustumCulled = this.#raysMesh.frustumCulled = false;
    this.#scene.add(this.#marbleMesh);
    this.#textures = [t.marble, t.gradient, t.maskR, t.maskG, t.maskB, t.noise];

    this.#resize();
    this.#resizeObserver = new ResizeObserver(() => this.#resize());
    this.#resizeObserver.observe(options.host);
    window.addEventListener("pointermove", this.#onPointer, { passive: true });
    this.advance(options.startAt ?? 0);
  }

  #onContextLost = (e: Event) => {
    e.preventDefault();
    this.stop();
    this.#o.onLost?.();
  };

  #onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const b = this.#o.host.getBoundingClientRect();
    if (!b.width || !b.height) return;
    this.#mouseTarget.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
  };

  #resize() {
    const w = this.#o.host.clientWidth;
    const h = this.#o.host.clientHeight;
    if (!w || !h) return;
    this.#gl.setSize(w, h, false);
    const u = this.#marbleMat.uniforms;
    u.uResolution.value.set(w, h, this.#dpr);
    u.uPlane.value.set(w, h);
    if (!this.#running) this.renderOnce();
  }

  get #running() {
    return this.#raf !== 0;
  }

  /** Moves the reveal clocks on by `dt` seconds, and the pointer follower with them. */
  #step(dt: number) {
    // edith eases the pointer by 9 percent a frame at 60 frames a second; this is the same, whatever the frame rate.
    this.#mouse.value.lerp(this.#mouseTarget, 1 - Math.pow(1 - 0.09, dt * 60));
    this.#run += dt;
    const speedUp = 2 - easeInOutQuad(Math.min(this.#run / INTRO_SECONDS, 1));
    const t = this.#marbleMat.uniforms.uTime.value as Vector3;
    t.x += dt * TUNED.timeFactorReveal * speedUp;
    t.y += dt * TUNED.timeFactorBoost;
    t.z += dt;
    this.#time.value += dt;
  }

  /** Plays the reveal forward by `seconds` without drawing. For a still image and for tests. */
  advance(seconds: number) {
    for (let s = 0; s < seconds; s += 1 / 60) this.#step(1 / 60);
  }

  #renderRays() {
    const gl = this.#gl;
    const previous = gl.getRenderTarget();
    gl.setRenderTarget(this.#loop);
    gl.render(this.#raysMesh, this.#camera);
    this.#blur.render(gl, this.#loop, this.#blurred);
    gl.setRenderTarget(previous);
  }

  /** One frame with everything up to date (rays included). Used for stills and after a resize while paused. */
  renderOnce() {
    this.#renderRays();
    this.#gl.render(this.#scene, this.#camera);
  }

  #frame = (now: number) => {
    this.#raf = requestAnimationFrame(this.#frame);
    const dt = Math.min((now - this.#last) / 1000, 0.1);
    this.#last = now;
    this.#frames++;
    this.#step(dt);
    if (this.#frames % 2 === 0) this.#renderRays();
    this.#gl.render(this.#scene, this.#camera);

    // A device that cannot hold about 22 frames a second gets the still instead. Judged over frames 30 to 120.
    if (!this.#slowReported && this.#frames > 30 && this.#frames <= 120) this.#dts.push(dt);
    if (!this.#slowReported && this.#frames === 120) {
      const sorted = [...this.#dts].sort((a, b) => a - b);
      if (sorted[Math.floor(sorted.length / 2)] > 0.045) {
        this.#slowReported = true;
        this.#o.onSlow?.();
      }
    }
  };

  start() {
    if (this.#running) return;
    this.#last = performance.now();
    this.#raf = requestAnimationFrame(this.#frame);
  }

  stop() {
    cancelAnimationFrame(this.#raf);
    this.#raf = 0;
  }

  dispose() {
    this.stop();
    window.removeEventListener("pointermove", this.#onPointer);
    this.#o.canvas.removeEventListener("webglcontextlost", this.#onContextLost);
    this.#resizeObserver.disconnect();
    this.#textures.forEach((t) => t.dispose());
    this.#loop.dispose();
    this.#blurred.dispose();
    this.#blur.dispose();
    this.#marbleMat.dispose();
    this.#raysMat.dispose();
    this.#gl.dispose();
    this.#gl.forceContextLoss();
  }
}
```

### 4.5 `src/components/sections/HeroMarbleBackground.tsx` (new)

```tsx
"use client";

// The edith marble behind a hero. It is the background only: the hero's own content sits above it (position: relative).
// Live on capable devices; a still image for people who ask for reduced motion or data saving, for browsers without WebGL 2,
// and for devices that cannot hold a steady frame rate. The three.js code is a separate chunk that loads after first paint.

import { useEffect, useRef, useState } from "react";

type Mode = "pending" | "live" | "still";

export function HeroMarbleBackground({ base = "/marble", slowCheck = true }: { base?: string; slowCheck?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    const el = host.current;
    const cv = canvas.current;
    if (!el || !cv) return;

    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || nav.connection?.saveData) {
      setMode("still");
      return;
    }

    // `?marble=force` keeps the live effect on a device that would be handed the still (software WebGL in tests, for one).
    const force = new URLSearchParams(window.location.search).get("marble") === "force";

    let cancelled = false;
    let marble: import("@/lib/marble/HeroMarble").HeroMarble | undefined;
    let io: IntersectionObserver | undefined;
    let visible = false;

    // Draw only while the hero is on screen and the tab is showing: a shader this size is not free.
    const sync = () => {
      if (!marble) return;
      if (visible && document.visibilityState === "visible") marble.start();
      else marble.stop();
    };
    const fallBack = () => {
      marble?.dispose();
      marble = undefined;
      setMode("still");
    };

    const boot = async () => {
      const { HeroMarble } = await import("@/lib/marble/HeroMarble");
      if (cancelled) return;
      if (!HeroMarble.supported()) return setMode("still");
      try {
        const m = await HeroMarble.create({ canvas: cv, host: el, base, onSlow: slowCheck && !force ? fallBack : undefined, onLost: fallBack });
        if (cancelled) return m.dispose();
        marble = m;
      } catch {
        return setMode("still");
      }
      marble.renderOnce();
      setMode("live");
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      }, { threshold: 0.02 });
      io.observe(el);
      document.addEventListener("visibilitychange", sync);
    };

    // After the first paint, when the browser is idle, so the headline is never waiting on the effect (Safari has no idle callback).
    const idle = typeof window.requestIdleCallback === "function";
    const handle = idle ? window.requestIdleCallback(() => void boot(), { timeout: 1500 }) : window.setTimeout(() => void boot(), 200);

    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      io?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      marble?.dispose();
      marble = undefined;
    };
  }, [base, slowCheck]);

  return (
    <div ref={host} className="hero-marble" data-mode={mode} aria-hidden="true">
      <canvas ref={canvas} className="hero-marble__canvas" />
      {mode === "still" ? <img className="hero-marble__still" src={`${base}/poster.webp`} alt="" decoding="async" /> : null}
      <noscript>
        <img className="hero-marble__still" src={`${base}/poster.webp`} alt="" />
      </noscript>
    </div>
  );
}
```

### 4.6 CSS: append to `src/app/globals.css`

```css
/* The hero marble (components/sections/HeroMarbleBackground.tsx). The hero is a `scene-dark`, so the page colour behind it is
   #0c0a09. The canvas is drawn on black; `screen` blending lifts that black to the page colour exactly (measured: hero and
   page both 12,10,9), so there is no visible box, while the veins keep their colour. */
.hero-marble {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.hero-marble__canvas,
.hero-marble__still {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  mix-blend-mode: screen;
}
.hero-marble__still {
  object-fit: cover;
  animation: hero-marble-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}
/* Nothing to show until the canvas has its first frame; it starts black, so no fade is needed for it. */
.hero-marble[data-mode="pending"] .hero-marble__canvas,
.hero-marble[data-mode="still"] .hero-marble__canvas {
  visibility: hidden;
}
@keyframes hero-marble-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* The header while it is over the home hero (a dark scene in both themes): the dark palette, no background of its own. */
.nav-on-dark {
  --bg: #0c0a09;
  --text-1: #f5f5f4;
  --text-2: #a8a29e;
  --text-3: #8a857f;
  --hairline: #292524;
  --hairline-strong: #44403c;
}
```

### 4.7 `src/components/sections/Hero.tsx`

Three changes: import the component, add `scene-dark` and `data-hero` to the section, and render the background first inside it.
Everything else stays exactly as it is.

```tsx
import { getTranslations } from "next-intl/server";
import { Parallax } from "@/components/studio/Parallax";
import { SocialIcons } from "@/components/shell/SocialIcons";
import { HeroMarbleBackground } from "@/components/sections/HeroMarbleBackground";

// ...the `enter` helper and the doc comment are unchanged...

export async function Hero() {
  const t = await getTranslations("home");

  return (
    <section data-hero className="scene-dark relative flex min-h-[92svh] items-center overflow-hidden">
      {/* edith's marble: behind everything, drawn after first paint (client component) */}
      <HeroMarbleBackground />
      {/* counter-drift on exit, the room stays, the words leave first */}
      <Parallax speed={-0.07} className="relative w-full">
        {/* ...the container, headline, lede and social row are unchanged... */}
      </Parallax>
    </section>
  );
}
```

The content sits above the marble because it comes later in the DOM and is positioned (`Parallax` is `relative`).

### 4.8 `src/components/shell/Nav.tsx`

Add one state, one effect and one class. Keep everything else.

```tsx
// with the other state, after `const [open, setOpen] = useState(false);`
const [overHero, setOverHero] = useState(false);

// after the effect that hides the header on scroll:
// On the home page the hero is a dark scene in both themes, so while the header is over it, it takes the dark palette.
const isHome = pathname === "/";
useEffect(() => {
  if (!isHome) {
    setOverHero(false);
    return;
  }
  const update = () => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    setOverHero(!!hero && hero.getBoundingClientRect().bottom > 64);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}, [isHome]);
```

and on the `<header>` element, turn the class string into a template literal:

```tsx
className={`fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]${overHero && !open ? " nav-on-dark" : ""}`}
```

`!open` matters: the mobile overlay is a light panel in light mode, and the burger lines must not turn light on it.
`pathname` here comes from next-intl's `usePathname` (`@/i18n/navigation`), which has no locale prefix, so `"/"` is the home page in
both languages.

### 4.9 Optional: cache the textures

They are not fingerprinted, so the default is a revalidation on every visit. In `next.config.ts`, inside `nextConfig`:

```ts
async headers() {
  return [{ source: "/marble/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] }];
},
```

Say so to Kevin if you add it: a replaced texture then takes up to a week to reach returning visitors.

## 5. Verify, with evidence

1. `npm run typecheck` and `npm run build` pass. In the build output, `three` must be in a separate lazy chunk, not in the home
   page's first-load JS. Report the first-load JS size before and after.
2. Serve it and drive it with Playwright. **Software WebGL is slow and will correctly trip the slow-device fallback**, so open the page
   as `/?marble=force` to test the live path (the ordinary URL tests the fallback). Use `--use-angle=swiftshader
   --enable-unsafe-swiftshader --ignore-gpu-blocklist`.
3. Screenshots, looked at, at 1440x900 and 390x844, in **dark and light theme** (`localStorage.setItem("theme", "light")`, reload),
   at scroll 0 and with the hero's bottom edge in view. Required:
   - the marble is the background, the headline, lede and social icons are readable on top of it;
   - dark theme: no visible rectangle at the hero's edges or at its bottom edge; measure hero and page pixels either side of the
     bottom edge, both `12,10,9` where the marble is dark;
   - light theme: the header logo, links and toggles are legible over the marble, and turn back to the light palette once the hero
     is scrolled past; the mobile menu overlay is still a light panel with visible burger lines;
   - the mobile screenshot fills the phone hero and does not look stretched.
4. Behaviour: with `?marble=force`, the canvas exists and the wrapper's `data-mode` becomes `live`; scrolling the hero out of
   view stops the animation frames and scrolling back resumes them; with `prefers-reduced-motion: reduce` emulated, `data-mode` is
   `still` and no WebGL context is created; with the network throttled, the headline paints before the three.js chunk arrives.
5. Nothing else moved: the other sections, the language switch and the theme toggle behave as before, and the hero's entrance
   animations still play.
6. Report honestly what you could not check (real GPU speed, a real phone).

## 6. Tell Kevin (do not decide for him)

- **Where the marble came from.** edith's own code comments describe its GLSL as "extracted verbatim from the production bundle"
  of "the original WebGL layer", which reads as taken from a different, original site. Nobody has checked where the textures came
  from either. That is worth settling before the marble goes on a public portfolio that Kevin uses for applications. It is his
  call; this file only copies what edith already ships.
- **Colour.** The portfolio's design is a warm monochrome with "one drop of colour" (`globals.css`). This hero is strongly coloured.
  That is what was asked for, and it is a change of character for the site.
- **Budget.** `PLAN.md` set a limit of under 30 KB added for the WebGL moment. This adds 126 KB gzip (lazy) and 755 KB of textures.
  The hero headline is server-rendered, so it is not delayed, but the number is far over that plan.
- **Phones and real GPUs.** Untested here. The slow-device fallback exists for this reason. If a mid-range phone struggles, lower the
  pixel ratio cap in `HeroMarble.ts` (`Math.min(..., 2)`, try 1.5) before anything else.
- **Light mode.** The hero stays dark and ends in a hard cut to the light page.

## 7. Undo

Delete `HeroMarbleBackground.tsx`, `src/lib/marble/`, `public/marble/` and the CSS block; revert the two edits; remove the two
dependencies. Nothing else was touched.
