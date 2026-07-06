# ULTRA PROMPT — kevinandrew.tech rebuild
### Paste into Claude Code at the root of a NEW empty repo. Self-contained; no other doc required.
### v1.1 — After Hours and Currently/now REMOVED. /leadership page ADDED (mentor evidence).
### Home = five beats: Hero → Select work ×3 → Doors (Research/Studio/Leadership) → Writing titles → Footer.
### Domain-agnostic: canonical URL is a single config constant. Register: senior-dev gravity throughout.

---

You are a senior creative engineer — the kind who has shipped Awwwards SOTD sites and also
maintains 99.9%-uptime infrastructure. You hold two standards simultaneously: **art-direction
taste** and **engineering rigor**. When they conflict, resolve toward restraint. You are
building the personal site of Kevin Andrew — someone whose operating pattern is: *notice the
overlooked problem → interrogate from first principles → architect → ship → write it down.*
The site must make visitors FEEL they've met an engineer-builder-with-a-research-practice
without one self-label appearing anywhere.

## STEP 0 — CAPABILITY INVENTORY (do this before any code)

List every skill, MCP server, and tool available in this environment (UI/UX skills,
frontend skills, creative/design skills, Magic MCP, Playwright/browser tooling, image
tooling, etc.). Produce a routing table: which capability you will use for which phase
(component scaffolding, design review passes, diagram/asset generation, visual verification,
accessibility audit). Use them; do not hand-roll what a tool does better. Post the table,
then proceed.

## OPERATING RULES

1. Work in the numbered phases at the end. NEVER advance past a failing gate.
2. After every visual milestone: run the dev server, screenshot at 1440 / 768 / 390 widths,
   LOOK at the screenshots, self-review against the acceptance criteria and the taste rules,
   iterate, only then commit. Verification artifacts (screenshots + Lighthouse output) are
   part of each phase's deliverable.
3. Anything marked [CONFIRM] is an unverified fact: build the slot, insert the placeholder
   text verbatim with the [CONFIRM] marker, and list all outstanding [CONFIRM]s at the end
   of every phase report. NEVER invent metrics, client names, or statuses.
4. Commit per phase with clear messages. Keep a running `BUILDLOG.md`.

## TASTE CONSTITUTION (violations = rejected work)

- **One typeface weight — 500 — everywhere.** Hierarchy via size and color only.
  (Single permitted exception: 400 for long-form case-study body >600 words, decided by eye.)
- **Warm monochrome.** Tailwind stone scale only. Zero hue accent in UI chrome. Color enters
  through work imagery alone. Background is #0C0A09, never #000.
- **One 800px column.** This is an essay, not a showcase grid. Breakout figures max 1080px;
  hero figures may go full-bleed.
- **Whitespace is the layout system.** 128–160px between homepage beats (desktop), 80–96px mobile. 8pt grid.
- **Bold text is a second reading channel**: bold the key phrases so someone reading ONLY
  bold gets the whole story.
- **Motion is physics, not decoration.** Everything eases like it has mass:
  `cubic-bezier(0.16,1,0.3,1)` family + named springs gentle(45/17) standard(120/20)
  snappy(400/28). Durations 200/400/800/1000ms only.
- **BANNED:** shadcn default cards, icon grids, skill badges, tech-logo walls, timelines,
  testimonial carousels, custom cursor blobs, preloaders >600ms, autoplay carousels,
  "Coming Soon" ghosts, handwriting fonts, hand-drawn scribbles/circles.
- **BANNED WORDS in copy:** founder, researcher, freelancer, passionate, journey, innovative,
  cutting-edge, results-driven, entrepreneur, crafting digital experiences.
- Every page ships with at least ONE earned detail a visitor could screenshot and remember.

## DESIGN TOKENS (the only source of visual truth — CSS custom properties)

### Type — Google Sans Flex via next/font/google (if unavailable in the package, self-host
woff2 from the Google Fonts css2 API — it IS in the catalog). Mono: Google Sans Code
(verify availability; fallback JetBrains Mono). Subset latin. Two families total.

| token | spec |
|---|---|
| display | clamp(2.25rem, 5.5vw, 3rem) / 1.1 / -0.02em / w500 |
| heading | clamp(1.75rem, 4vw, 2.5rem) / 1.1 / -0.02em / w500 |
| lede | clamp(1.125rem, 2vw, 1.35rem) / 1.5 / w500 |
| body-lg | 1.25rem / 1.4 / w500 |
| body | 1rem / 1.4 / w500 |
| meta | 0.85rem / 1.4 / w500 |
| mono | 0.8125rem / 1.5 (Google Sans Code) |

### Color (dual theme; `data-theme` on <html>; dark is default)

| token | dark | light |
|---|---|---|
| --bg | #0C0A09 | #FAFAF9 |
| --bg-elevated | #1C1917 | #F5F5F4 |
| --text-1 | #F5F5F4 | #1C1917 |
| --text-2 | #A8A29E | #57534E |
| --text-3 | #78716C | #78716C |
| --hairline | #292524 | #E7E5E4 |
| --pill-bg / --pill-text | #F5F5F4 / #1C1917 | #1C1917 / #F5F5F4 |

Buttons: 100px-radius pills, ~10px 20px padding, meta-size type.

## STACK

Next.js 15 App Router, SSG · TypeScript strict · Tailwind v4 CSS-first tokens ·
GSAP 3 + ScrollTrigger (@gsap/react) · Lenis · OGL for the particle field (r3f only if OGL
path exceeds a day; keep WebGL path <30KB gzip) · next-intl (en default, de) · MDX content ·
next/og generated OG cards (site's own type system: title on stone-950 with particle
texture) · Vercel target.

```
app/[locale]/(site)/{page,work,work/[slug],research,studio,writing,writing/[slug],about,after-hours,now,contact}
components/{primitives,motion,sections,canvas}
content/{work,writing,now}/*.mdx      messages/{en,de}.json      lib/{motion,seo}
```

## INFORMATION ARCHITECTURE + PER-PAGE SPECS

**Nav (all pages):** `Kevin Andrew` wordmark left · Work / Research / Studio / Writing /
About / Contact right · theme toggle · EN|DE. Meta-size. Magnetic links (≤4px cursor pull,
spring standard). Hide on scroll-down, spring-reveal on scroll-up. NOTE: /after-hours and
/now are NOT in the nav — they are discovered via About page and footer (deliberate
curiosity mechanics).

**Footer (all pages):** socials (GitHub, LinkedIn, email, Instagram) · `Chennai · HH:MM IST`
live clock · EN|DE · theme · "© 2026 · built by hand" · short-hash easter egg linking to the
site repo [CONFIRM repo public].

### / — HOME (exactly six beats, nothing else)

1. **Hero.** H1 display, first-person quiet: "I build systems that outlast the problems
   they solve." [CONFIRM final wording]. Lede with bold skim-channel: "**Cloud
   infrastructure, protocols, and applied AI** — designed from first principles, **shipped
   end to end**, and written down so others can build on them. Based in **Chennai**, working
   everywhere." Pills: `View work` `Contact` + 3 social icons. Behind: particle field
   (Phase 6; static gradient-field placeholder until then).
2. **Currently — the ledger block.** Mono type on hairline-ruled rows + `updated — jul 2026`
   stamp:
   ```
   ▸ building     etch — cryptographic provenance for code · rust / cloudflare workers
   ▸ researching  auctus — market-based cloud allocation · paper under review
   ▸ writing      "on becoming before knowing why"
   ```
   [CONFIRM all three lines] Each row links (work/etch, research, writing/...). Rows type
   in once on first view.
3. **Select work.** EXACTLY three rows: `Protocol · 6 min` → title → one-liner. Hairline
   separators draw in on scroll. Hover: preview image follows cursor with spring lag
   (gentle), slight scale settle. Rows: Etch / STEM / Auctus.
4. **Three doors.** h2 + two lines + link ×3:
   Research — "Some problems need more than code. Formal work on provenance and allocation
   markets — plus the open questions I'm sitting with."
   Studio — "A small practice for people who need systems that simply work. Select client
   work, and how I run it."
   Writing — "Notes to myself, published."
5. **Footer** (as above).

Acceptance: a stranger scrolls once in 40 seconds and can say what kind of person this is;
they cannot find a single self-label doing that work.

### /work — index
Three flagships (same row pattern) + "Selected archive" — compact list of REAL, linkable
projects only (VEGA, Neurix, Factory OS… only those with resolving links + real imagery).
No ghosts: if it has no public artifact, it does not appear.

### /work/[slug] — case-study template (MDX-driven)
Header (`Domain · read-time · year`, H1, one-line dek) → full-bleed hero figure →
**TL;DR block: Problem / Approach / State** — three bold-led one-liners, scannable in 20s →
**The Noticing** (what everyone else missed; the signature section) → Architecture (designed
monochrome SVG diagrams, mono-type labels, captioned — generate these properly, they are
design deliverables, not afterthoughts) → Decisions (2–3 "why X, not Y" blocks) →
State (LABEL / big value / context ×3 — honest values only) → What's next (one paragraph) →
next-project links. Pull-quotes are spec excerpts / decision annotations in mono — never
fake testimonials. Figures get ±6% scale-parallax.

Content skeletons:
- **etch** — Protocol · 2026. Dek: "Cryptographic provenance for code — a receipt layer for
  authorship in the AI era." Noticing angle: everyone argued about whether AI wrote the code;
  nobody built the layer that could prove who did. State: [CONFIRM version/what-works/spec].
- **stem** — System · 2025–26. Dek + metrics + screenshots [CONFIRM all; request assets].
- **auctus** — Research · 2024–26. Dek: "What if cloud resources cleared like a market?"
  ⚠️ ANONYMITY GATE: before writing ANY specifics, confirm the venue's double-blind policy
  allows a public identity-linked page; until confirmed, the page says only "a paper on
  cloud resource allocation is under review." [CONFIRM]

### /research
Not a publications dump. Two sections: **Formal** (publications list w/ venues + the
under-review line, anonymity-gated) and **Open questions** (3–4 one-line questions Kevin is
sitting with, mono type — e.g. "who owns a refactor?" / "can allocation be fair AND
efficient under adversarial load?"). One earned detail: each open question links to a
now-entry or essay where he's chewing on it. [CONFIRM publication list]

### /studio
The practice page, evidence-first: "How I work" (3 short principles: demo before deposit ·
flat pricing · systems over pages) → select outcomes (Mamacita's Miami Eats + [CONFIRM
which Edith client work is shareable + permissions]) → quiet pill CTA "Work with the studio →"
linking out to Edith Studio [CONFIRM URL]. Personal site stays person-first; hard sell
lives on the studio's own site.

### /writing + /writing/[slug]
Index = titles + dates only (the existing three essays [CONFIRM full texts exist]). Detail =
55–65ch measure, lede-size body, generous rhythm, reading-time, no hero images. Typography
does all the work.

### /about
Portrait (monochrome treatment) → "The short version" (5 lines) → "How I work" (first
principles, systems, shipping — 3 short paragraphs) → "Elsewhere" (deep space, physics,
theology, football — one wry line each) → **Trajectory ledger**: `Vellore → Chennai → (next
entry pending)` in mono — mysterious confidence, no visa-speak, no "aspiring" anything →
quiet door: "the unserious parts →" /after-hours.

### /now
Full ledger: reverse-chron MDX entries (month, 2–4 mono lines each). The living proof the
site is an ongoing record, not a monument. Seed with 3 real months [CONFIRM].

### /after-hours
Port the existing zoom/pan canvas concept (zones: Photos / Music / Thoughts / Doodle /
Ronaldo) from the old repo's AfterHours.tsx, matured: kill clip-art GIFs, unify imagery
treatment (monochrome-leaning grade), keep the doodle canvas + floating handwritten-style
notes REPLACED with mono-type notes. Keyboard navigable + a linear list-view fallback
(a11y). Timebox: port + polish only, no new zones.

### /contact
"Let's build something that lasts." Email-first (mailto, obvious, huge), calendar link
[CONFIRM], socials, location/time. No form at v1.

### /404
Particle field playground + "nothing here. gravity still works." + link home.

## MOTION SPEC

- Lenis smooth scroll (desktop; native on touch) + GSAP ScrollTrigger.
- Hero H1: masked per-line reveal — translateY 100%→0, 0.5° rotate settle, 80ms stagger, 1000ms.
- Section entrances: y 24→0, scale 0.98→1, blur 4→0, 800ms, once.
- Work rows: hairline width 0→100% draw; hover image-follow with spring(gentle) + lag.
- Case figures: ±6% scale-parallax.
- Page transitions: View Transitions API; work-row title morphs into case-study header;
  300ms fade fallback.
- System cursor (no custom cursor). Magnetism + follow effects supply the physics feel.
- **Particle field (Phase 6):** 2–3k points, gravitational drift, cursor = weak attractor
  with inertial velocity smoothing; stone-400 low-alpha on dark / graphite on light;
  DPR-capped at 2; pauses when off-viewport or tab hidden; lazy-loaded AFTER LCP; static
  gradient-field fallback for reduced-motion/low-end/loading. Budget <30KB gzip.
- `prefers-reduced-motion`: opacity-only equivalents everywhere; zero translate/scale/blur.

## PERFORMANCE / QUALITY GATES (hard)

LCP <2.0s · CLS <0.05 · INP <200ms · initial JS <180KB gzip · 60fps scroll on mid-range
Android · Lighthouse ≥95 in all four categories · axe: zero critical issues · WCAG AA
contrast in BOTH themes · every internal/external link resolves (no private GitHub links —
if a repo is private at launch, the link does not ship).

## i18n

next-intl, `en` default, `de` secondary. DE register: **du** [CONFIRM]. DE scope: UI chrome,
Home, About, Contact. Case studies/writing stay EN with a one-line DE note. Write natural
German, not translated English — but EVERY DE string ships only after Kevin's explicit
sign-off (launch gate).

## SEO

Per-page metadata + canonical [CONFIRM domain: kevinandrew.tech vs kevinandrewa.tech] ·
JSON-LD (Person on /, CreativeWork per case study) · sitemap/robots · generated OG cards
per page · favicon: "K." wordmark glyph, Google Sans Flex 500, stone-100 on stone-950.

## PHASES (gates from above apply at every step)

0. Repo init, fonts, tokens, theme system (data-theme + toggle + system-pref detect),
   layout primitives (Column, Section, Pill, HairlineRow, Figure). GATE: both themes
   pixel-reviewed; tokens are the only color source anywhere.
1. Shell: nav, footer, page transitions, Lenis+GSAP infra, reduced-motion plumbing.
2. Home, six beats (static field placeholder). GATE: 40-second read test on screenshots.
3. Case-study template + etch/stem/auctus MDX + DESIGNED architecture diagrams (SVG).
4. Research, Studio, Writing (+details), About, Now, Contact, 404. GATE: no page feels
   like a stub; one earned detail each.
5. After Hours port + maturity pass.
6. Particle field + sitewide motion polish. GATE: fps + bundle budgets.
7. i18n DE + SEO/OG + analytics + full a11y & perf audit. GATE: Lighthouse ≥95×4, axe clean,
   [CONFIRM] list resolved or slots visibly parked.
8. Launch checklist: link resolution sweep, GitHub-public verification, favicon, domain,
   redirect from old vercel.app, final BUILDLOG summary + remaining [CONFIRM] report.

Begin with STEP 0 (capability inventory), then Phase 0. Ship taste.
