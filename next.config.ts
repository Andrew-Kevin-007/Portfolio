import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
};

export default withNextIntl(nextConfig);
