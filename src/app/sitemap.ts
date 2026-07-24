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

  return all.flatMap((path) => [
    {
      url: `${SITE_URL}${path}`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${SITE_URL}${path}`,
          de: `${SITE_URL}/de${path}`,
        },
      },
    },
  ]);
}
