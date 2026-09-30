import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
    return ["/:film(stem-.+)", "/marble/:path*", "/gifs/:path*"].map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: week }],
    }));
  },
};

export default withNextIntl(nextConfig);
