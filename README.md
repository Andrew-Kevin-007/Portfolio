# kevinandrew.tech

A quiet ledger with physics underneath.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (31 static pages, EN + DE)
```

Deploy: push to GitHub → import in Vercel. Zero config needed.

## Edit content (the slot architecture)

The site is designed so **identity never depends on any single project**. Everything
rotates through typed content slots:

| What | Where |
|---|---|
| Identity, email, URLs | `src/content/site.ts` |
| Case studies (adds routes automatically) | `src/content/work.ts` |
| Archive rows | `src/content/work.ts` → `archive` |
| Essays (adds routes automatically) | `src/content/writing.ts` |
| UI strings + Home/About/Contact copy (EN/DE) | `messages/en.json`, `messages/de.json` |
| Research / Studio / Leadership page copy | their `page.tsx` files |

To add the *next big thing*: append one `CaseStudy` object to `work.ts`, give it a
diagram in `src/components/diagrams/Diagrams.tsx`, done — home and /work update themselves.

## Rules the design lives by

One typeface weight (500). One 800px column. Stone monochrome, no hue in the chrome.
Bold is a color shift, not a weight shift. Motion eases like it has mass. No dead links,
no fabricated numbers, no "Coming Soon".

See `BUILDLOG.md` for the pre-launch [CONFIRM] checklist.
