"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * The display surface inside mockups/macbookpro.png — the full glass, edge
 * to edge, as fractions of the image box. The notch is redrawn in CSS on
 * top of the footage, so hardware and film are one assembly and can never
 * drift apart.
 */
const SCREEN = { left: 0.1015, top: 0.0263, width: 0.797, height: 0.874 };
const NOTCH = { width: 0.113, height: 0.035 };

/**
 * FeaturedDock — the Apple product-film hand-off, one dark room like the
 * rest of the house. You start inside the screen: the footage is the whole
 * viewport. Scrolling zooms the entire assembly out — laptop, glass, and
 * notch under ONE transform, one easing, one set of physics — until the
 * MacBook sits whole under its "Featured." heading, film still running.
 * Direct-drive from scroll progress and untransformed layout, so the
 * geometry is exact at every frame and every viewport.
 */
export function FeaturedDock() {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const capRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    const scrim = scrimRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const heading = headingRef.current;
    const cap = capRef.current;
    if (
      !section || !sticky || !stage || !wrap ||
      !scrim || !video || !overlay || !heading || !cap
    )
      return;

    // footage decodes only while the theater is on screen, and survives
    // tab switches (IO alone misses the visibility hand-off)
    let onScreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && document.visibilityState === "visible")
          video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(section);
    const onVis = () => {
      if (document.visibilityState === "visible" && onScreen)
        video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // static composition: heading, laptop with the film docked, caption
      section.style.height = "auto";
      sticky.style.position = "static";
      sticky.style.height = "auto";
      sticky.style.paddingBlock = "6rem";
      overlay.style.display = "none";
      heading.style.opacity = "1";
      heading.style.transform = "none";
      cap.style.opacity = "1";
      cap.style.transform = "none";
      cap.style.pointerEvents = "auto";
      scrim.style.opacity = "0";
      return () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
      };
    }

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const sec = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      if (sec.bottom < -100 || sec.top > vh + 100) return;

      const p = clamp(-sec.top / (sec.height - vh), 0, 1);

      // untransformed stage geometry: offsets against the sticky frame,
      // so the running transform never feeds back into the measurement
      const sr = sticky.getBoundingClientRect();
      const sx = sr.left + stage.offsetLeft;
      const sy = sr.top + stage.offsetTop;
      const sw = stage.offsetWidth;
      const sh = stage.offsetHeight;
      const scx = sx + sw * (SCREEN.left + SCREEN.width / 2);
      const scy = sy + sh * (SCREEN.top + SCREEN.height / 2);

      // one assembly, one easing: laptop + glass + notch zoom out together
      const dockP = easeInOut(clamp((p - 0.14) / 0.58, 0, 1));
      const s0 =
        Math.max(vw / (sw * SCREEN.width), vh / (sh * SCREEN.height)) * 1.06;
      const s = s0 + (1 - s0) * dockP;
      const tx = (vw / 2 - scx) * (1 - dockP);
      const ty = (vh / 2 - scy) * (1 - dockP);

      stage.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
        2
      )}px, 0) scale(${s.toFixed(4)})`;
      wrap.style.borderRadius = `${(dockP * sw * SCREEN.width * 0.012).toFixed(
        1
      )}px`;
      scrim.style.opacity = (0.45 * (1 - dockP)).toFixed(3);

      // phase 1 — the title owns the film
      const tp = clamp(p / 0.12, 0, 1);
      overlay.style.opacity = (1 - tp).toFixed(3);
      overlay.style.transform = `translateY(${(-tp * 40).toFixed(1)}px)`;

      // phase 3 — heading lands above the hardware, caption beneath it
      const hp = clamp((p - 0.7) / 0.18, 0, 1);
      heading.style.opacity = hp.toFixed(3);
      heading.style.transform = `translateY(${((1 - hp) * 14).toFixed(1)}px)`;
      const cp = clamp((p - 0.8) / 0.14, 0, 1);
      cap.style.opacity = cp.toFixed(3);
      cap.style.transform = `translateY(${((1 - cp) * 14).toFixed(1)}px)`;
      cap.style.pointerEvents = cp > 0.5 ? "auto" : "none";
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "280vh" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden"
      >
        {/* the heading that receives the film — above the hardware */}
        <h2
          ref={headingRef}
          className="mb-10 text-heading opacity-0 sm:mb-14"
        >
          {t("featuredTitle")}
          <span className="text-text-3">.</span>
        </h2>

        {/* the assembly: laptop + glass + notch, one body */}
        <div
          ref={stageRef}
          className="relative w-[min(82vw,900px,calc((100svh-250px)*1.62))] will-change-transform"
          style={{
            transformOrigin: `${(SCREEN.left + SCREEN.width / 2) * 100}% ${
              (SCREEN.top + SCREEN.height / 2) * 100
            }%`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mockups/macbookpro.png"
            alt=""
            aria-hidden
            draggable={false}
            className="w-full"
          />
          <div
            ref={wrapRef}
            className="absolute overflow-hidden bg-black"
            style={{
              left: `${SCREEN.left * 100}%`,
              top: `${SCREEN.top * 100}%`,
              width: `${SCREEN.width * 100}%`,
              height: `${SCREEN.height * 100}%`,
            }}
          >
            <video
              ref={videoRef}
              src="/stem.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={t("featuredSub")}
              className="h-full w-full object-cover"
            />
            {/* legibility veil under the title; lifts as the film docks */}
            <div
              ref={scrimRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-black"
              style={{ opacity: 0.45 }}
            />
            {/* the notch, part of the assembly — glued to the glass */}
            <div
              aria-hidden
              className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-[6px] bg-black"
              style={{
                width: `${NOTCH.width * 100}%`,
                height: `${NOTCH.height * 100}%`,
              }}
            />
          </div>
        </div>

        {/* the sign-off: one line, in the same voice as the hero */}
        <div
          ref={capRef}
          className="mt-9 flex flex-col items-center gap-2 opacity-0 sm:mt-11"
        >
          <Link
            href="/work/stem"
            className="text-monosm text-text-3 transition-colors duration-300 hover:text-text-1"
          >
            One of the ideas that actually shipped →
          </Link>
          <Link
            href="/work"
            className="text-monosm text-text-3 transition-colors duration-300 hover:text-text-1"
          >
            {t("moreWork")}
          </Link>
        </div>

        {/* phase 1 overlay — the title alone over the full-bleed film */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <h2 className="text-display" style={{ color: "#fff" }}>
            {t("featuredTitle")}
            <span className="text-white/40">.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
