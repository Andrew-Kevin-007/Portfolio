"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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

    // Nothing downloads at page load (preload="none", the poster stands in).
    // The theater sits right under the hero, so the first scroll is the
    // signal: a visitor who leaves from the hero never pays for the film,
    // and anyone reading on has it streaming before it fills the screen.
    const warmUp = () => {
      window.removeEventListener("scroll", warmUp);
      if (video.readyState > 0 || !video.paused) return;
      video.preload = "auto";
      video.load();
    };
    if (window.scrollY > 0) warmUp();
    else window.addEventListener("scroll", warmUp, { passive: true });

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
        window.removeEventListener("scroll", warmUp);
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
      };
    }

    // The scroll choreography runs only while the section is near the
    // viewport; everywhere else on the page it costs nothing.
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const sec = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;

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
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "100px 0px" }
    );
    near.observe(section);

    return () => {
      cancelAnimationFrame(raf);
      near.disconnect();
      window.removeEventListener("scroll", warmUp);
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
          <Image
            src="/mockups/macbookpro.png"
            alt=""
            aria-hidden
            draggable={false}
            width={2048}
            height={1237}
            sizes="(max-width: 900px) 82vw, 900px"
            className="w-full h-auto"
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
              muted
              loop
              playsInline
              preload="none"
              poster="/stem-poster.webp"
              aria-label={t("featuredSub")}
              className="h-full w-full object-cover"
            >
              <source src="/stem-720.mp4" media="(max-width: 767px)" type="video/mp4" />
              <source src="/stem-1080.mp4" type="video/mp4" />
            </video>
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
            {t("featuredShipped")}
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
          {/* The title is white because it sits over the dark film — but an
              a11y/contrast checker can't see the video and would measure the
              white text against the page background (which is near-white in
              light theme → fails). The opaque dark plate gives it a real dark
              backing to measure; the matching box-shadow feathers the plate so
              it dissolves into the near-black footage and stays invisible. */}
          <h2
            className="text-display"
            style={{
              color: "#fff",
              backgroundColor: "#0c0a09",
              boxShadow: "0 0 60px 45px #0c0a09",
              borderRadius: "16px",
              padding: "0.02em 0.25em",
            }}
          >
            {t("featuredTitle")}
            <span className="text-white/40">.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
