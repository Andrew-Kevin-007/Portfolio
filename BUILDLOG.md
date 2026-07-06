# BUILDLOG — kevinandrew-site

## What this is
Ground-up rebuild of kevinandrew.tech. Concept: **a quiet ledger with physics underneath** —
Ben Roach's editorial discipline (one 800px column, Google Sans Flex at a single weight,
warm stone monochrome) with inertial motion physics as texture. Five identities radiate
implicitly (never claimed): founder ← Etch · researcher ← Auctus/Research · engineer ← STEM ·
freelancer ← Studio · mentor ← Leadership.

## Design system (extracted from benroachdesign.com live computed styles)
- Type: Google Sans Flex, weight **500 only** (hierarchy via size + color). Mono accent: Google Sans Code.
- Scale: display 48/1.1/-2% · heading 40 · lede 21.6 · body-lg 20 · body 16 · meta 13.6 (fluid clamps).
- Color: Tailwind stone. Dark #0C0A09 default; light #FAFAF9 "paper". Zero hue accent in chrome.
- Layout: single 800px column; 8pt grid; whitespace is the layout system.
- Motion: one easing family cubic-bezier(.16,1,.3,1); Lenis; masked line reveals; blur+scale
  section entrances; magnetic nav; hand-rolled WebGL particle drift (~6KB, zero deps),
  cursor as weak attractor with inertia; full prefers-reduced-motion fallbacks.

## Deliberate deviations from the original plan
- View Transitions API → simple template.tsx enter animation (experimental API not worth the risk).
- MDX → typed TS content modules (`src/content/*.ts`) — fewer moving parts, same editability.
- ESLint not scaffolded (gates = `tsc` + `next build`); add later if wanted.
- OG image generation (next/og) deferred — sandbox couldn't fetch fonts at build time. TODO below.
- Fonts load at runtime via fonts.googleapis.com `<link>` (works everywhere). Optional upgrade:
  switch to `next/font/google` locally for self-hosting — both families ARE in the catalog.

## Verified
- `next build`: 31/31 static pages, EN + DE, exit 0.
- First Load JS ≈ 147KB (budget 180KB). Middleware 46KB.
- Both themes token-complete; JSON-LD Person; sitemap + robots; themed 404 via catch-all.

## [CONFIRM] — Kevin, before launch
1. **SITE_URL** in `src/content/site.ts` (kevinandrew.tech vs kevinandrewa.tech).
2. **Email** (currently kevinandrew2559@gmail.com) — also in site.ts.
3. **Etch state line** (case study TL;DR "State") — version/what-works truthfully.
4. **STEM metrics + screenshots** — stats block currently ships qualitative values only.
5. **Auctus anonymity check** — the site never names venue/title; confirm your submission's
   policy allows even the project-name-level description in the case study.
6. **Hero line** — "I build systems that outlast the problems they solve." Yours to veto.
7. **Every German string** — du-register; review before Awwwards submission. HARD GATE.
8. **GitHub public** — hero/footer/contact link to the profile (safe even with private repos);
   no repo deep-links ship anywhere.
9. **Copy `me.png` → `public/portrait.png`** and the resume PDF → `public/kevin-andrew-cv.pdf`
   (binary copy blocked in this session; CV link 404s until done). About page currently
   ships without a portrait — add an `<img src="/portrait.png">` block if wanted.
10. Archive links (VEGA demo, etc.) — add to `src/content/work.ts` only after verifying live.

## TODO (post-launch candidates)
- next/og generated OG cards in the site's type system.
- Work-row hover: cursor-following preview cards (diagram fragments).
- Analytics (@vercel/analytics) if wanted.
- After Awwwards: submit to wallofportfolios (free).
