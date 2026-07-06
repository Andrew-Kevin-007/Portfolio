# KEVINANDREW.TECH — REBUILD MASTER PLAN
### Codename: QUIET LEDGER · v1.1 · July 2026
### Status: PROCEED given — building in-session, in `rebuild/`

> **v1.1 REVISIONS (Kevin, 03 Jul):**
> 1. **After Hours: scrapped entirely** (page, nav door, assets — gone)
> 2. **Currently block + /now page: scrapped** — "now" is its own genre of generic. The ledger
>    survives as texture (mono metadata, dates, honesty), not as a component.
> 3. **Domain: build domain-agnostic** — canonical URL is one config constant
> 4. **Target feel: senior-dev gravity** radiating five identities implicitly —
>    founder · researcher · engineer · freelancer · **mentor**. Mentor gets a real surface:
>    a **/leadership** page (Ben Roach has one — philosophy + rooms actually run).
>    Homepage becomes **five beats**: Hero → Select work (3) → Three doors
>    (Research / Studio / Leadership) → Writing (titles only) → Footer.
>    Identity coverage: work rows = founder/engineer/researcher · doors = researcher/freelancer/mentor ·
>    writing = the thinker. No gimmick block carries anything.

---

## 0. THESIS

**Anchor on the invariant, not the instance.**

Projects (Etch, Auctus, whatever comes after) are instances. The invariant is the operating
pattern: *notice the overlooked problem → interrogate it from first principles → architect the
system → ship it → write it down.* The site's spine is the pattern. Projects are rotating
exhibits in a permanent museum — replaceable by design.

**Reverse psychology = evidence over assertion.** The words "founder," "researcher,"
"freelancer," "engineer" never appear as self-labels. Instead:

| Visitor sees | Visitor concludes |
|---|---|
| A protocol spec + open-core repo | founder |
| A paper under review + methodology notes | researcher |
| Client outcomes + a working studio practice | freelancer |
| A commit-style "currently" log that keeps moving | engineer who ships |
| Essays with restraint | thinks in systems |

**Concept in one line:** *a quiet ledger with physics underneath.*
Ben Roach's editorial discipline as the skeleton; inertial/orbital motion physics as the
texture (the aphelion instinct expressed through motion curves — never literal planets).

---

## 1. LOCKED DECISIONS (from Kevin, 03 Jul 2026)

1. **Stack:** fresh Next.js 15 build (port i18n strings, writings, After Hours concept, project data)
2. **Motion budget:** earned depth — restrained surface + one signature WebGL moment + rich scroll choreography, hard performance floor
3. **Flagship case studies:** Etch (protocol) · STEM (shipped system) · Auctus (research)
4. **No stats bar** → replaced by the "currently" block (building / researching / writing)
5. **Hero voice:** first-person quiet
6. **Theme:** dark default (stone-950) + light option (stone-50 paper) — dual-theme tokens from Phase 0
7. **Launch scope:** full site, EN + DE at launch — DE limited to UI/Home/About/Contact; Kevin personally verifies every DE string (hard gate)
8. **Studio:** evidence + link out — practice page on personal site, Edith Studio remains its own brand

---

## 2. DESIGN SYSTEM (extracted from benroachdesign.com live computed styles)

### 2.1 Typography
- **Primary: Google Sans Flex** — confirmed available on Google Fonts (css2 API returns 200).
  Load via `next/font/google`; if the package lags the catalog, self-host woff2 pulled from the css2 API.
- **THE RULE: one weight — 500 — everywhere.** Headings, body, nav, footer. Hierarchy from
  size + color only. This single constraint is what makes the site feel expensive.
  (Exception permitted: 400 for >600-word long-form case-study body if 500 fatigues — decide by eye in Phase 3.)
- **Mono accent: Google Sans Code** (verify on Google Fonts; fallback JetBrains Mono).
  Used ONLY for: currently-block, timestamps, metadata labels, spec excerpts, figure captions.
  This is our one addition to Ben's system — it carries the "ledger" identity.

**Fluid type scale** (anchored to Ben's desktop values, measured at 1396px viewport):

| Token | Value | Ben's reference |
|---|---|---|
| `display` | clamp(2.25rem, 5.5vw, 3rem) / 1.1 / -0.02em | h1: 48/52.8, -0.96px |
| `heading` | clamp(1.75rem, 4vw, 2.5rem) / 1.1 / -0.02em | stat h2: 40/44, -0.8px |
| `lede` | clamp(1.125rem, 2vw, 1.35rem) / 1.5 | 21.6/32.4 |
| `body-lg` | 1.25rem / 1.4 | 20/28 |
| `body` | 1rem / 1.4 | 16/22.4 |
| `meta` | 0.85rem / 1.4 | 13.6/19.04 |
| `mono` | 0.8125rem / 1.5 | (ours) |

**Inline bold is a second reading channel:** bold key phrases in every lede/paragraph so a
skimmer reading only the bold still gets the full story. (Ben does this everywhere.)

### 2.2 Color — Tailwind *stone* scale, zero hue accent in UI chrome

| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | #0C0A09 (stone-950) | #FAFAF9 (stone-50) |
| `--bg-elevated` | #1C1917 (stone-900) | #F5F5F4 (stone-100) |
| `--text-1` | #F5F5F4 (stone-100) | #1C1917 (stone-900) |
| `--text-2` | #A8A29E (stone-400) | #57534E (stone-600) |
| `--text-3` | #78716C (stone-500) | #78716C (stone-500) |
| `--hairline` | #292524 (stone-800) | #E7E5E4 (stone-200) |
| `--pill-bg` / `--pill-text` | #F5F5F4 / #1C1917 | #1C1917 / #F5F5F4 |

Color enters ONLY through work imagery and After Hours. Buttons = full-radius pills (100px),
`--pill-bg`, padding ~10px 20px. Warm black, never #000.

### 2.3 Layout
- **Single 800px content column** (`max-w-[800px]`, px-24 mobile gutters). It is an essay, not a showcase grid.
- Case-study figures may break out to 1080px; hero figures full-bleed.
- 8pt spacing grid. Homepage section rhythm: 128–160px desktop / 80–96px mobile.
- Nav: wordmark left, links right, meta-size type.

### 2.4 Banned (anti-generic hard rules)
No shadcn default cards · no lucide icon grids · no skill-badge clouds · no tech-logo walls ·
no timeline components · no testimonial carousels · no custom cursor blob · no preloader over
600ms · no autoplay carousels · no double-tap hearts · no "Coming Soon" ghosts · no handwriting
fonts · no hand-drawn circles/scribbles.
Banned words in copy: founder, researcher, freelancer, passionate, journey, innovative,
cutting-edge, results-driven, entrepreneur, "crafting digital experiences."

---

## 3. INFORMATION ARCHITECTURE

```
/                 Home — 6 beats, one column, zero dump
/work             Index: 3 flagships + honest selected archive (no ghosts)
/work/[slug]      Case studies: etch, stem, auctus (template scales to future work)
/research         Formal outputs + "questions I'm sitting with" + methodology notes
/studio           The practice: how I work, select client outcomes → link out to Edith Studio
/writing          Essays (3 at launch)
/writing/[slug]
/about            The human. Arc, elsewhere-interests, trajectory ledger, door to After Hours
/after-hours      Matured zoom/pan canvas world (NOT in main nav — discovered via About + footer)
/now              Full ledger page — reverse-chron log of what's being built (the anti-anchor machine)
/contact          Email-first + calendar link (no form at v1)
/404              Tiny physics toy: "nothing here. gravity still works."
```

Nav: `Kevin Andrew` wordmark · Work / Research / Studio / Writing / About / Contact ·
theme toggle · EN|DE. After Hours and /now are deliberately hidden doors — curiosity mechanics
reward explorers (Awwwards judges explore).

---

## 4. HOMEPAGE — THE SIX BEATS

**Beat 1 — Hero.** First-person quiet H1, workshop from:
- "I build systems that outlast the problems they solve." ← current favourite
- "I find the problems everyone steps over — then build what removes them."
- "I build quiet systems for loud problems."

Lede (~2 sentences, bolded skim-channel): **cloud infrastructure, protocols, and applied AI** —
designed from first principles, **shipped end to end**, and written down so others can build on
them. Based in **Chennai**, working everywhere.
Two pill CTAs: `View work` `Contact` + social icons (GitHub, LinkedIn, email).
Behind: the WebGL particle drift (§6), barely-there.

**Beat 2 — Currently (the ledger block).** Mono type, timestamped, three moving lines:
```
updated — jul 2026
▸ building     etch — cryptographic provenance for code · rust / cloudflare workers
▸ researching  auctus — market-based cloud allocation · paper under review
▸ writing      "on becoming before knowing why"
```
Each line links deeper. The `updated` stamp proves the site is alive. THIS is where the
current flagship lives — in a slot designed to be overwritten. [CONFIRM exact three lines]

**Beat 3 — Select work.** Exactly three rows, Ben's anatomy:
`Protocol · 6 min` / title / one-liner. Hover: image reveal follows cursor with spring lag.

**Beat 4 — Three doors.** Research / Studio / Writing — each h2 + two-line paragraph + link.
Draft copy:
- *Research* — "Some problems need more than code. Formal work on provenance and allocation markets — plus the open questions I'm sitting with."
- *Studio* — "A small practice for people who need systems that simply work. Select client work, and how I run it."
- *Writing* — "Notes to myself, published."

**Beat 5 — Footer.** Socials · email · `Chennai · 14:32 IST` live clock · EN|DE · theme ·
"© 2026 · built by hand" · tiny commit-hash easter egg (links to site repo once public).

Six beats. One column. A visitor leaves the homepage in 40 seconds knowing *what kind of
person this is* — and curious enough to click one level deeper. That's the whole job.

---

## 5. CASE STUDY TEMPLATE (Ben's anatomy + engineer's twist)

1. Header: `Domain · read-time · year` → H1 → one-line dek
2. Full-bleed hero figure
3. **TL;DR block — Problem / Approach / State** (three bold-led one-liners, scannable in 20s).
   "State" not "Results" — honest for in-progress protocols ("open-core · v0.3 · spec public").
4. **The Noticing** — signature section: what everyone else missed and why. This is where
   the thinking quality shows; it's the section that does the reverse-psychology work.
5. Architecture — designed monochrome diagrams (engineer-grade, captioned, mono labels).
6. Decisions — 2–3 "why X, not Y" blocks (first-principles evidence).
7. State/Results — `LABEL / big value / one-line context` ×3, honest numbers only.
8. What's next — one paragraph. Openness reads as confidence.
9. Next-project links.

Pull-quote style: NOT fake testimonials — spec excerpts and design-decision annotations in mono.

**Per-study notes:**
- **Etch:** spec-fragment aesthetic; protocol diagram; the provenance problem framed as
  noticing ("everyone argued about AI authorship; nobody built the receipt layer").
- **STEM:** the finisher-proof; pipeline diagram; dashboard screenshots [NEED ASSETS from Kevin];
  real metrics [CONFIRM].
- **Auctus:** paper-style figures; abstract excerpt; status line [CONFIRM — see §9 RISK on
  double-blind anonymity BEFORE publishing any details].

---

## 6. MOTION SYSTEM — "EARNED DEPTH"

**Tokens:** durations 200/400/800/1000ms · one easing family `cubic-bezier(0.16,1,0.3,1)` ·
named springs: gentle(45/17), standard(120/20), snappy(400/28) (stiffness/damping).

**Foundation:** Lenis smooth scroll + GSAP 3 + ScrollTrigger (`@gsap/react` useGSAP).

**Choreography:**
- Hero headline: masked per-line reveal (translateY 100%→0, slight rotate, 80ms stagger).
- Section entrances: rise + scale 0.98→1 + blur 4px→0 (depth-of-field, not just fade).
- Currently-block: lines type in ledger-style, once.
- Work rows: hairline border-draw on enter; hover image follows cursor with spring lag.
- Case-study figures: ±6% parallax with subtle scale (depth, not slide).
- Nav: magnetic links (≤4px pull), hide-on-scroll-down / spring-reveal-on-up.
- Page transitions: View Transitions API — work-row title morphs into case-study header.
  Fallback: 300ms fade.
- Cursor: DEFAULT system cursor (custom cursors are a dated cliché). Cursor-adjacent physics
  instead: magnetic elements + image-follow.

**The one signature WebGL moment:** hero background particle field.
~2–3k particles, gravitational drift, cursor as weak attractor with inertial lag; monochrome
(stone-400 @ low alpha on dark / graphite on paper); DPR-capped; pauses off-viewport;
lazy-loaded after LCP; <30KB path (OGL preferred over three.js/r3f for bundle — decide at build).
Static gradient-field fallback: reduced-motion, low-end devices, and while loading.

**Reduced motion:** every animation has an opacity-only equivalent. Full site usable with zero motion.

**Performance floor (non-negotiable, client-credibility depends on it):**
LCP < 2.0s · CLS < 0.05 · INP < 200ms · initial JS < 180KB gzip · 60fps scroll on mid-range
Android · Lighthouse ≥ 95 across all categories.

---

## 7. TECH STACK

Next.js 15 App Router (SSG) · TypeScript strict · Tailwind v4 (CSS-first tokens) ·
GSAP + ScrollTrigger + Lenis · OGL (or minimal r3f) for particles · next-intl (EN/DE) ·
MDX for case studies/writing/now-entries · next/og auto-generated OG cards in the site's own
type system · Vercel deploy · Vercel Analytics or Plausible.

```
app/[locale]/(site)/{page,work,research,studio,writing,about,after-hours,now,contact}
components/{primitives,motion,sections,canvas}
content/{work,writing,research,now}/*.mdx
lib/{motion,i18n,seo}
messages/{en,de}.json
```

**i18n:** DE register = **du** (informal-professional; standard for personal creative
portfolios) [CONFIRM]. DE covers UI + Home + About + Contact; case studies EN with a note.
Kevin's manual review of every DE string is a launch gate.

**A11y:** WCAG AA · visible focus states in both themes · After Hours gets a linear
list-view alternative + escape hatch · contrast verified (stone-400 on stone-950 ≈ 10:1 ✓).

**SEO:** per-page metadata · JSON-LD Person + CreativeWork · sitemap · canonical on final
domain [CONFIRM domain] · favicon: "K." mark in Google Sans Flex on stone-950 at launch
(bespoke glyph can come later — anything beats shipping the Vercel logo).

---

## 8. BUILD PHASES (each = build → skill-assisted review → screenshot verification at
1440/768/390 → Lighthouse gate → commit; never advance with a failing gate)

| Phase | Deliverable | Acceptance |
|---|---|---|
| 0 | Repo, tokens, fonts, theme system, layout primitives | Both themes render; type scale matches §2.1; tokens are the ONLY color source |
| 1 | Shell: nav, footer, transitions, Lenis+GSAP infra, reduced-motion plumbing | Route morphs work; magnetic nav; RM fallback verified |
| 2 | Homepage (6 beats, static field placeholder for WebGL) | 40-second read test; zero dump; skim-channel bolds present |
| 3 | Case-study template + Etch + STEM + Auctus | TL;DR block pattern; designed diagrams; no fabricated numbers |
| 4 | Research, Studio, Writing, About, Now, Contact, 404 | No stub feels like a stub; every page has one earned detail |
| 5 | After Hours maturity port | Play kept, clip-art killed; keyboard + linear fallback |
| 6 | WebGL particle field + motion polish pass | 60fps mid-range Android; <30KB added; LCP unaffected |
| 7 | i18n DE, SEO/OG, analytics, a11y + perf audits | Lighthouse ≥95 ×4; axe clean; Kevin's DE sign-off |
| 8 | Content truth pass + launch checklist (§10) | Every link resolves; GitHub public; favicon; domain live |

Post-launch: 2 weeks of real-traffic polish → Awwwards submission (SOTD entry fee applies) +
wallofportfolios (free) → September 2026. Site must be content-locked by mid-August:
it is your professional face for DAAD October 2026.

---

## 9. RISK REGISTER (prosecutorial section)

1. **ACM SoCC is double-blind.** Publishing Auctus specifics (title, figures, identity-linked
   claims) while under review could violate anonymity policy and burn the submission.
   VERIFY the venue's policy before the research page ships anything beyond
   "a paper on cloud resource allocation is under review." HARD GATE.
2. **Depth asymmetry vs Ben Roach.** He shows $1B outcomes; you show in-progress protocols.
   Mitigation: the Noticing section (thinking quality > outcome size) + honest State blocks.
   Never inflate. A real "v0.3, spec public" beats a fake "trusted by developers worldwide."
3. **Staleness.** A "currently" block last updated 8 months ago is worse than a stats bar.
   Mitigation: MDX entries, 5-minute monthly ritual, calendar reminder.
4. **German quality.** Kevin's review gate; du-register consistency; no machine-German ships.
5. **After Hours scope creep.** It's a mini-app. Timebox: port + maturity pass only.
6. **Zero visual assets for Etch/Auctus.** Diagrams must be DESIGNED (not found) — budgeted
   in Phase 3. STEM screenshots must come from Kevin.
7. **GitHub private = dead links.** Everything linked must resolve publicly at launch, or the
   link doesn't ship.

---

## 10. OPEN FACTS — Kevin answers before/at PROCEED

1. **Domain:** kevinandrew.tech or kevinandrewa.tech? (both appear in your materials)
2. **Public contact email:** kevinandrew2559@gmail.com or other?
3. **STEM:** screenshots/demo/repo links + 2–3 honest metrics + the one-line "what it is"
4. **Etch honest state:** version, what works today, repo visibility plan, spec doc exists?
5. **Auctus:** exact public-safe status line + venue anonymity check (§9.1)
6. **Currently block:** confirm the three lines (§4 Beat 2 draft)
7. **Client permissions:** can Mamacita's be named/shown? Which Edith outcomes are shareable?
8. **Photos:** curate keep/kill from the existing a–k.jpeg set for About/After Hours
9. **Writings:** do full texts exist for all three essays? Ship all three?
10. **German register:** confirm du (my rec) vs Sie
11. **GitHub public date** (pre-launch gate)
12. **Old plan doc:** if the previous phase-1 plan file exists, share it — I'll mine "studio etc."
