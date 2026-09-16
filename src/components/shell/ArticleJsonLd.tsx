import { NAME, SITE_URL } from "@/content/site";

/**
 * Per-page structured data for the detail routes.
 *
 * This is the piece that does the entity work. The Person node on its own
 * says "a Kevin Andrew exists"; an Article whose `author` resolves by @id to
 * that same node says "this specific Kevin Andrew wrote this specific thing".
 * Repeated across every essay and paper, that is the association Google
 * documents for connecting a body of work to a person — and the only lever
 * available against the namesakes who already hold the name.
 *
 * BreadcrumbList travels with it: it is how a crawler learns the site is a
 * hierarchy (section -> item) rather than 36 flat URLs.
 */

/** "April 2026" -> "2026-04". Schema.org accepts a partial ISO 8601 date. */
const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08",
  september: "09", october: "10", november: "11", december: "12",
};
function isoDate(published?: string): string | undefined {
  if (!published) return undefined;
  const m = published.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return /^\d{4}(-\d{2})*$/.test(published.trim()) ? published.trim() : undefined;
  const mm = MONTHS[m[1].toLowerCase()];
  return mm ? `${m[2]}-${mm}` : m[2];
}

export function ArticleJsonLd({
  type,
  headline,
  description,
  section,
  sectionPath,
  path,
  published,
  locale,
}: {
  /** ScholarlyArticle for papers, Article for essays and case studies. */
  type: "Article" | "ScholarlyArticle";
  headline: string;
  description: string;
  /** Human label of the parent section, e.g. "Writing". */
  section: string;
  /** Parent section path, e.g. "/writing". */
  sectionPath: string;
  /** This page's path, e.g. "/writing/some-slug". */
  path: string;
  /** Free-form date string from the content registry; omitted if unparseable. */
  published?: string;
  locale: string;
}) {
  // localePrefix is "as-needed": en lives at the bare path, de under /de.
  const base = locale === "de" ? `${SITE_URL}/de` : SITE_URL;
  const datePublished = isoDate(published);

  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${base}${path}#article`,
    headline,
    description,
    url: `${base}${path}`,
    inLanguage: locale,
    // By @id, not by name — a bare author string cannot be reconciled to a
    // person, which is the whole failure mode this markup exists to avoid.
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}${path}` },
  };
  if (datePublished) article.datePublished = datePublished;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: NAME, item: base },
      { "@type": "ListItem", position: 2, name: section, item: `${base}${sectionPath}` },
      { "@type": "ListItem", position: 3, name: headline },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
