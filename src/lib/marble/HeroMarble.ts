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
  type Texture,
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
  /** Seconds of the reveal already played, so the veins are already showing when it first appears. */
  startAt?: number;
  /** Size of the light-ray pass relative to the marble texture. edith draws it at 0.5; it is blurred, so less is cheaper and
   * looks the same. */
  raysScale?: number;
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
    const m = new HeroMarble(options, { marble, gradient, maskR, maskG, maskB, noise });
    await m.#warm();
    return m;
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
  #textures: Texture[];
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
  #ready = false;
  #resizeObserver: ResizeObserver;

  private constructor(options: HeroMarbleOptions, t: Record<"marble" | "gradient" | "maskR" | "maskG" | "maskB" | "noise", import("three").Texture>) {
    this.#o = options;
    this.#dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
    this.#gl = new WebGLRenderer({ canvas: options.canvas, powerPreference: "high-performance", antialias: false, alpha: false });
    this.#gl.setClearColor(0x000000);
    this.#gl.setPixelRatio(this.#dpr);
    options.canvas.addEventListener("webglcontextlost", this.#onContextLost);

    // Light rays: the marble smeared radially around the pointer, drawn small and blurred (edith draws it at half size).
    const raysScale = options.raysScale ?? 0.5;
    const w = Math.round(t.marble.image.width * raysScale);
    const h = Math.round(t.marble.image.height * raysScale);
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
    if (!this.#running && this.#ready) this.renderOnce();
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

  /** Uploads the textures and compiles the shaders before the first frame, off the critical moment of a hover. Where the
   * browser supports it (KHR_parallel_shader_compile), compiling happens in the background instead of blocking. */
  async #warm() {
    for (const t of this.#textures) this.#gl.initTexture(t);
    await this.#gl.compileAsync(this.#raysMesh, this.#camera);
    await this.#gl.compileAsync(this.#scene, this.#camera);
    this.#ready = true;
    this.renderOnce();
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

    // A device that cannot hold about 22 frames a second gets the still instead. Judged on the median frame after the first
    // few, once there are 90 frames or 1.5 seconds of them, so a struggling machine is let off in seconds, not after a minute.
    if (this.#slowReported) return;
    if (this.#frames > 8) this.#dts.push(dt);
    if (this.#dts.length >= 90 || (this.#dts.length >= 8 && this.#dts.reduce((a, b) => a + b, 0) >= 1.5)) {
      const sorted = [...this.#dts].sort((a, b) => a - b);
      this.#slowReported = true;
      if (sorted[Math.floor(sorted.length / 2)] > 0.045) this.#o.onSlow?.();
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
