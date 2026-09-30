# kevinandrew.tech

A quiet ledger with physics underneath.

## Run

```bash
npm install
npm run dev        # http://localhost:3000 (Turbopack)
npm run build      # production build: every page in English and German
npm run typecheck
```

Deploy: push to `main` and Vercel builds it. It needs Node 20.9 or newer.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS 4 · next-intl (EN and DE) · Lenis smooth scroll.

There is no animation library: motion is `requestAnimationFrame`, CSS and the Web Animations API. three.js is used for one thing, the edith marble behind the home page's edith row, and it loads on demand as the row comes into view.

## Edit content

The site is designed so **identity never depends on any single project**. Everything rotates through typed content slots:

| What | Where |
| --- | --- |
| Identity, email, URLs | `src/content/site.ts` |
| Case studies (adds routes automatically) | `src/content/work.ts` → `studies` |
| Archive rows | `src/content/work.ts` → `archive` |
| Papers (adds routes automatically) | `src/content/research.ts` |
| Essays (adds routes automatically) | `src/content/writing.ts` |
| UI strings and Home / About / Contact copy (EN and DE) | `messages/en.json`, `messages/de.json` |

To add the next case study, append one `CaseStudy` object to `studies` in `work.ts`. Home and `/work` update themselves.

## Worth knowing

- **edith.** The home page's "From my desk" row and the About page link to edith, which lives at `https://edith-plum.vercel.app`. The URL is `EDITH_URL` in `site.ts`. The marble is `src/components/sections/DoorMarble.tsx` with its renderer in `src/lib/marble/`; the gradient-on-text hover is `src/components/sections/WipeText.tsx`. `edith-context.md` is a briefing on what edith is, for anyone (or any agent) writing about it. `hero-marble/` and `hero-button/` hold the implementation notes the effects were built from.
- **Studio is retired.** The old `/studio` page was taken down on 28 September 2026. Its code is kept, unrouted, in `src/archive/studio/`; nothing links to it.
- **Routing.** `src/proxy.ts` is next-intl's locale routing (Next 16's name for what was `middleware.ts`).
- **Weight.** The Featured film is served as 1080p and 720p files and nothing downloads until the first scroll. The marble's code and textures load when its row nears the viewport. Heavy static files are cached for a week, so rename a file instead of replacing it in place.
- **The original briefs** (`PLAN.md`, `CLAUDE_CODE_PROMPT.md`) and `BUILDLOG.md` record how the site was first built. Each now starts with a note on what has changed since. This README is the current description.

## Rules the design lives by

One typeface weight (500). One 800px column. Stone monochrome, with no hue in the chrome (the edith gradient appears only on hover). Bold is a color shift, not a weight shift. Motion eases like it has mass. No dead links, no fabricated numbers, no "Coming Soon".
