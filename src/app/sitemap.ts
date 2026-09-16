import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { studies } from "@/content/work";
import { essays } from "@/content/writing";
import { papers } from "@/content/research";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/work",
    "/research",
    "/studio",
    "/writing",
    "/about",
    "/contact",
  ];
  const dynamicPaths = [
    ...studies.map((s) => `/work/${s.slug}`),
    ...essays.map((e) => `/writing/${e.slug}`),
    ...papers.map((p) => `/research/${p.slug}`),
  ];

  const all = [...staticPaths, ...dynamicPaths];
  const now = new Date();

  // hreflang has to be reciprocal: a /de page that is index,follow and
  // self-canonical must appear as its own <loc>, not only as an alternate
  // hanging off the English one. Emitting EN-only made every de annotation
  // one-way, which is the documented condition for Google discarding the
  // whole cluster. Every entry now carries the same full language map,
  // x-default included, so each URL points back at all the others.
  const languages = (path: string) => ({
    en: `${SITE_URL}${path}`,
    de: `${SITE_URL}/de${path}`,
    "x-default": `${SITE_URL}${path}`,
  });

  return all.flatMap((path) => [
    {
      url: `${SITE_URL}${path}`,
      lastModified: now,
      alternates: { languages: languages(path) },
    },
    {
      url: `${SITE_URL}/de${path}`,
      lastModified: now,
      alternates: { languages: languages(path) },
    },
  ]);
}
