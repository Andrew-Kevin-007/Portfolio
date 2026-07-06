"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Magnetic } from "@/components/motion/Magnetic";
import { LocaleSwitch } from "./LocaleSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { NAME } from "@/content/site";

const LINKS = [
  { href: "/work", key: "work" },
  { href: "/research", key: "research" },
  { href: "/studio", key: "studio" },
  { href: "/writing", key: "writing" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  // Hide on scroll down, spring back on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > lastY.current && y > 140) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay on navigation + lock scroll while open
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    // While the overlay is open, the page behind it must be unreachable —
    // visually (overflow) AND for keyboard/screen readers (inert).
    const behind = [
      document.getElementById("main"),
      document.querySelector("footer"),
    ];
    if (open) {
      window.__lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      behind.forEach((el) => el && (el.inert = true));
    } else {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      behind.forEach((el) => el && (el.inert = false));
    }
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      behind.forEach((el) => el && (el.inert = false));
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Studio's own hero is a fixed dark theatre, independent of the site
  // theme (see .scene-dark in globals.css) — the nav rides on top of it,
  // so it's pinned dark here too, regardless of the light/dark toggle.
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isStudio ? "scene-dark" : ""
        }`}
        style={{
          transform: hidden && !open ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <div
          className="border-b transition-colors duration-500"
          style={{
            borderColor: scrolled && !open ? "var(--hairline)" : "transparent",
            background:
              scrolled && !open
                ? "color-mix(in srgb, var(--bg) 82%, transparent)"
                : "transparent",
            backdropFilter: scrolled && !open ? "blur(12px)" : "none",
            WebkitBackdropFilter: scrolled && !open ? "blur(12px)" : "none",
          }}
        >
          <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 lg:px-10">
            <Link
              href="/"
              className="text-body text-text-1 transition-opacity duration-300 hover:opacity-70"
              aria-label={t("home")}
            >
              {NAME}
              <span className="text-text-3">.</span>
            </Link>

            {/* Desktop */}
            <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
              {LINKS.map(({ href, key }) => (
                <Magnetic key={key}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={`text-meta transition-colors duration-300 ${
                      isActive(href)
                        ? href === "/studio"
                          ? "text-intel"
                          : "text-text-1"
                        : "text-text-3 hover:text-text-1"
                    }`}
                  >
                    {t(key)}
                  </Link>
                </Magnetic>
              ))}
              <span className="mx-1 h-3.5 w-px bg-hairline-strong" aria-hidden />
              <LocaleSwitch />
              <ThemeToggle />
            </nav>

            {/* Mobile trigger */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? t("close") : t("menu")}
                className="flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
              >
                <span
                  className="block h-px w-5 bg-text-1 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: open ? "translateY(3px) rotate(45deg)" : "none",
                  }}
                />
                <span
                  className="block h-px w-5 bg-text-1 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: open ? "translateY(-3px) rotate(-45deg)" : "none",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 flex flex-col justify-center bg-bg px-8 transition-opacity duration-[400ms] md:hidden ${
          isStudio ? "scene-dark" : ""
        }`}
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-5" aria-label="Mobile">
          {LINKS.map(({ href, key }, i) => (
            <span key={key} className="line-mask">
              <span
                style={{
                  animationPlayState: open ? "running" : "paused",
                  ["--line-delay" as string]: `${80 + i * 55}ms`,
                }}
              >
                <Link
                  href={href}
                  className={`text-heading ${
                    isActive(href)
                      ? href === "/studio"
                        ? "text-intel"
                        : "text-text-1"
                      : "text-text-2"
                  }`}
                >
                  {t(key)}
                </Link>
              </span>
            </span>
          ))}
        </nav>
        <div className="mt-12 flex items-center gap-6">
          <LocaleSwitch />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
