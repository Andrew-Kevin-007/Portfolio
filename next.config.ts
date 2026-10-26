import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Security headers for every response. The site is static: it has no API
 * routes, no forms and no outbound requests, and every resource it loads is
 * same-origin, so the policy can be strict.
 *
 * script-src and style-src keep 'unsafe-inline' because Next.js emits inline
 * hydration scripts, the JSON-LD blocks are inline, and components set style
 * attributes. A nonce would force every page to render per request, giving up
 * the static output. Everything else is locked down: no framing (the site
 * cannot be wrapped in someone else's page), no plugins, no foreign base tag,
 * no form posts to other hosts, and no third-party script or connection.
 *
 * Loosening this is deliberate work: a new embed, font host or analytics
 * script has to be added here first, or the browser will block it.
 * HSTS is already sent by the host (Vercel), so it is not repeated here.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16.3 otherwise writes AGENTS.md and CLAUDE.md into the project on every `next dev`.
  agentRules: false,
  poweredByHeader: false,
  devIndicators: false,
  // Serve modern formats (AVIF, then WebP) for anything routed through
  // next/image — the largest saving in Lighthouse's "improve image delivery".
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The OG route reads the display font off disk at request time. Next's file
  // tracer cannot see through join(process.cwd(), ...), so on Vercel the .woff
  // was never bundled into that function and every request threw ENOENT — a
  // hard 500 on every share card. Trace it explicitly.
  outputFileTracingIncludes: {
    "/[locale]/opengraph-image": ["./src/fonts/google-sans-flex-og.woff"],
  },
  // The heavy public assets (film, poster, marble textures, After Hours
  // loops) are not fingerprinted, so by default every repeat visit
  // revalidates them. A week of caching: a replaced file under the same name
  // takes up to that long to reach returning visitors — rename it instead.
  async headers() {
    const week = "public, max-age=604800, stale-while-revalidate=86400";
    const assets = ["/:film(stem-.+)", "/marble/:path*", "/gifs/:path*"].map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: week }],
    }));
    return [{ source: "/:path*", headers: securityHeaders }, ...assets];
  },
};

export default withNextIntl(nextConfig);
