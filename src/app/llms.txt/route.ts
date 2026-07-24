import { NAME, SITE_URL } from "@/content/site";
import { studies } from "@/content/work";
import { essays } from "@/content/writing";
import { papers } from "@/content/research";

/**
 * /llms.txt — an llmstxt.org-style map of the site for AI agents and tools.
 * Generated from the same content registries the pages render from, so it
 * never drifts. Lives at the app root (like robots.ts / sitemap.ts); the dot
 * in the path keeps it clear of the next-intl locale middleware.
 */
export const dynamic = "force-static";

/** Link text: no brackets (they'd break the markdown link), single-spaced. */
const label = (s: string) => s.replace(/[\[\]]/g, "").replace(/\s+/g, " ").trim();
/** Descriptions: drop the **bold** channel markers, single line. */
const desc = (s: string) => s.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();

const item = (title: string, url: string, d: string) =>
  `- [${label(title)}](${url}): ${desc(d)}`;

export function GET() {
  const work = studies
    .map((s) => item(`${s.name} — ${s.title}`, `${SITE_URL}/work/${s.slug}`, s.oneLiner))
    .join("\n");

  const writing = essays
    .map((e) => item(e.title, `${SITE_URL}/writing/${e.slug}`, e.description))
    .join("\n");

  const research = papers
    .map((p) => item(p.title, `${SITE_URL}/research/${p.slug}`, p.oneLiner))
    .join("\n");

  const body = `# ${NAME}

> ${NAME} builds quiet systems for loud problems — engineering and applied-AI work, documented as honest case studies with no fabricated metrics. This file maps the site for AI agents and tools; every link resolves to a full page.

## Work

Flagship case studies — the problem, the approach, and the honest current state.

${work}

## Writing

Essays.

${writing}

## Research

Papers and formal work — same honesty rules as the case studies.

${research}

## Studio

- [Studio](${SITE_URL}/studio): Edith Studio — product and systems work for real businesses.

## Optional

- [About](${SITE_URL}/about): Background and how Kevin works.
- [Contact](${SITE_URL}/contact): Ways to get in touch.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
