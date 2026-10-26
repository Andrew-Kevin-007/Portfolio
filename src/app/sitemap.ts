import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { studies } from "@/content/work";
import { essays } from "@/content/writing";
import { papers } from "@/content/research";

/** "April 2026" -> a Date, or undefined when the string is not that shape. */
function parseMonthYear(published: string): Date | undefined {
  const d = new Date(`${published.trim()} 1 UTC`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Pages with translated chrome and an indexable /de twin.
  const translatedPaths = [
    "",
    "/work",
    "/research",
    "/writing",
    "/about",
    "/contact",
    "/links",
  ];

  // Detail pages: the body is English on every route, so /de is not a
  // translation. Those URLs canonicalise to the English page and are left
  // out of the sitemap, with no hreflang pair.
  const articles: { path: string; lastModified?: Date }[] = [
    ...studies.map((s) => ({ path: `/work/${s.slug}` })),
    ...papers.map((p) => ({ path: `/research/${p.slug}` })),
    ...essays.map((e) => ({
      path: `/writing/${e.slug}`,
      lastModified: parseMonthYear(e.published),
    })),
  ];

  // hreflang has to be reciprocal: a /de page that is index,follow and
  // self-canonical must appear as its own <loc>, not only as an alternate
  // hanging off the English one. Every translated entry carries the same
  // full language map, x-default included, so each URL points back at all
  // the others.
  const languages = (path: string) => ({
    en: `${SITE_URL}${path}`,
    de: `${SITE_URL}/de${path}`,
    "x-default": `${SITE_URL}${path}`,
  });

  // No lastModified on pages without a real content date: a build-time
  // timestamp on every URL says "everything changed" on every deploy.
  const translated = translatedPaths.flatMap((path) => [
    {
      url: `${SITE_URL}${path}`,
      alternates: { languages: languages(path) },
    },
    {
      url: `${SITE_URL}/de${path}`,
      alternates: { languages: languages(path) },
    },
  ]);

  const english = articles.map(({ path, lastModified }) => ({
    url: `${SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
  }));

  return [...translated, ...english];
}
