# edith's "Become a Catalyst" hover effect on a button in the portfolio hero: implementation

Written for: a Claude Code terminal agent working in `D:\Portfolio-Main\Portfolio` (kevinandrew.tech), for Kevin.

**Goal.** Put one button in the portfolio's home hero that behaves exactly like the hero button on the edith site
(https://edith-plum.vercel.app). On hover, a gradient in edith's marble colours (gold, orange, red, magenta) wipes across the pill
through a wobbly noise distortion. The glow follows the pointer on a spring, stretches when the pointer moves fast, and drifts
gently when it rests. Kevin asked for "that hover effect".

**Scope.** One new component, one block of CSS, one small wrapper, one edit to `Hero.tsx`. No new dependency (gsap is already here).
Do not commit or push. Show Kevin the result first.

## 0. What has already been proven (so you do not redo it)

Built and tested in a scratch project (Vite, React 19 in StrictMode, gsap 3.13, TypeScript 5.9 strict) next to a copy of edith's
own `Button.tsx`. It has **not** been run inside this Next.js project yet, which is your job (section 5).

| Check | Result |
| --- | --- |
| Same behaviour as edith's button | Both versions driven through the same scripted hover (in from the left, fast move to the right, out) on a frozen clock. At 13 points, four runs, the glow centre and focus, glow radius, wipe width and distortion strength were **identical, value for value**, for edith's original and for this port. |
| Same pixels | In one full run the resting frame and all 7 compared transition frames were identical (mean difference 0.000 out of 255). In later runs this port reproduced itself exactly every time, while edith's original varied from run to run by up to 3.3 in mid-transition frames, which is rendering noise in that test page, not the logic (the state values above were identical throughout). |
| Same size | edith's button measures 197 x 45 px at 1440 wide (font 14.4 px) and 228 x 52 px on a phone (font 16.64 px). Height 3.125, side padding 1.25, gap 0.9375 and icon height 1.25, all times the font size, so this port is written in `em`. The label uses this site's own font, so the pill's width will differ from edith's; its height and proportions do not. |
| Readable at every stop | Label `#0c0a09` on the six gradient colours: 10.7, 8.0, 5.5, 4.9, 5.1 and **4.55** (the lowest, on the pink at the far end). Resting pill `#f5f5f4` with that label: 18.1. |
| Behaviour (real browser, StrictMode) | 12 checks pass: the wipe is closed at rest; hover opens it; the glow starts at the pointer and follows it across; leaving closes it and removes the animation step; StrictMode does not double the step; unmounting mid hover cleans up; no console errors; keyboard focus plays the wipe centred and blur closes it; a mouse click focusing the button does not; reduced motion is quick with no distortion; touch plays it centred. |
| Not measured | It was tested in Chromium only (Safari and Firefox untested). SVG filters like this one are supported everywhere but render slightly differently, so look in them. It was not run on a real phone. |

## 1. Reference (read only, on this machine)

edith (`D:\page_content\web`): `components/ui/Button.tsx` (the original, about 230 lines), `lib/theme.ts` (`hoverStops`, the six
colours), `components/sections/Hero.tsx` (where it is used). Its comment says it is the "Button 'Base' of the original", see section 6.

## 2. Rules for this repository

- Next 15.5 App Router, React 19, next-intl (`[locale]` routes, `@/i18n/navigation` `Link`), Tailwind 4, TypeScript strict, gsap ^3.13
  (already installed). Dark is the default theme and `[data-theme="light"]` swaps the tokens: check both.
- **Do not use edith's Tailwind classes.** Its `h-50`, `px-20`, `type-body-sm` and the rest are edith's compiled stylesheet and mean
  something else here. Everything below is plain CSS.
- No en or em dashes (U+2013, U+2014) in anything. British spelling. **No new visible text**: the label comes from the existing
  translations (`nav.contact`).
- Do not change anything outside the files named in section 4. `npm run typecheck` and `npm run build` must pass.
- **Another session is editing this repository** (at the time of writing: `messages/*.json`, `src/app/globals.css`,
  `src/components/sections/Doors.tsx`, `package.json`, a new `DoorMarble.tsx`, and `hero-marble/`, `public/marble/`, `src/lib/marble/`).
  Do not revert, stash, reformat or commit any of it. Run `git status` first, re-read `Hero.tsx` and `globals.css` immediately
  before you edit them (they may have changed), append your CSS rather than rewriting the file, and report any file you changed
  beyond the ones named here.

## 3. Design decisions (already made)

1. **A port, not a copy.** The edith component is tied to its own stack (its Tailwind classes, `RouterLink`, `LinkItem`, `theme`).
   This one keeps the animation code as it is and replaces those: plain `em` CSS, an `as` prop for the link component, and the six
   colours as a constant. The physics constants (stiffness 120, damping 14, smear 0.06), the noise filter (`baseFrequency` 0.035, four
   octaves, seed 5) and the timings (1 s, `power2.out`, distortion 150 down to 40) are edith's, unchanged.
2. **Fixed colours: a light pill with dark text, in both themes.** The label must stay readable while the wipe is only part way
   across. A dark pill with a light label (what this site's light theme would normally give) fails that. On a dark surface it is
   exactly edith's button. On the light theme's light page the resting pill gets a hairline (an inset shadow, so the size does not
   change and the gradient still covers it), using this site's own `--hairline-strong`.
3. **Two additions to edith's behaviour,** both small and tested: the wipe also plays on keyboard focus (centred; edith's is
   mouse-only), and with reduced motion it is quick (0.25 s) and undistorted, where edith's still plays the full second.
4. **Which button.** The default is one quiet button, label `nav.contact` ("Contact" in English, "Kontakt" in German), linking to
   `/contact`. No new copy is invented. It is one line to change (section 4.4); alternatives are `nav.work` with `/work`, or the Edith
   site (`EDITH_URL` in `content/site.ts`). Kevin decides, tell him.

## 4. Steps

### 4.1 `src/components/ui/HoverGradientButton.tsx` (new)

```tsx
"use client";

// A pill button with edith's hover effect (edith: components/ui/Button.tsx). On hover a gradient in the marble's colours wipes in
// through a fractal-noise displacement filter. The gradient's centre follows the pointer on a damped spring, fast movement
// stretches the glow and drags its hot spot behind the motion, and a slow drift keeps it moving when the pointer rests.
// Touch devices and reduced-motion users get the same gradient, centred and still.
// Beyond edith: the effect also plays on keyboard focus (centred), and with reduced motion the wipe is short and undistorted.
//
// Use it on a dark surface. The resting pill is light with dark text, and the label has to stay readable while the wipe is only
// part way across, so the colours are fixed (see the .hgb rules) and do not follow the light and dark theme.

import { useCallback, useEffect, useId, useRef, type AnchorHTMLAttributes, type ElementType, type FocusEvent, type MouseEvent, type ReactNode } from "react";
import { gsap } from "gsap";

/** edith's hover colours (lib/theme.ts hoverStops), sampled from its marble. The label keeps 4.5:1 contrast on every stop. */
const STOPS = ["#FEAF01", "#FF8301", "#FF3702", "#F70C5A", "#E803D1", "#CE3AAD"] as const;

// Spring on the glow's centre, per second. Damping ratio 14 / (2 * sqrt(120)) = 0.64: under-damped, so the glow
// overshoots a touch and settles, like light catching up with the cursor.
const STIFFNESS = 120;
const DAMPING = 14;
/** How far fast movement pulls the hot spot back along the motion, in seconds of velocity. */
const SMEAR = 0.06;

type Sim = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; w: number; h: number; t: number; on: boolean };

const media = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;
const livePointer = () => media("(hover: hover) and (pointer: fine)") && !media("(prefers-reduced-motion: reduce)");

type Props = {
  /** What to render as. Defaults to `a` (or `button` with no href). For an internal link in next-intl pass its `Link`. */
  as?: ElementType;
  href?: string;
  className?: string;
  children: ReactNode;
  /** Shown after the label, for example an arrow. Sized to 1.25 times the font size. */
  icon?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className">;

export function HoverGradientButton({ as, href, className, children, icon, onMouseEnter, onMouseMove, onMouseLeave, onFocus, onBlur, ...rest }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const filterId = `hgb-filter-${uid}`;
  const gradId = `hgb-grad-${uid}`;
  const fill = useRef<SVGRectElement>(null);
  const glow = useRef<SVGRadialGradientElement>(null);
  const displacement = useRef<SVGFEDisplacementMapElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const sim = useRef<Sim>({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, w: 0, h: 0, t: 0, on: false });

  const draw = useCallback(() => {
    const s = sim.current;
    const g = glow.current;
    if (!g) return;
    const speed = Math.hypot(s.vx, s.vy);
    const r = s.w * (0.75 + Math.min(speed / 1500, 0.45));
    // keep the focal point inside the circle however fast the pointer moves
    const k = speed ? Math.min(1, (0.5 * r) / (speed * SMEAR)) : 0;
    g.setAttribute("cx", s.x.toFixed(1));
    g.setAttribute("cy", s.y.toFixed(1));
    g.setAttribute("fx", (s.x - s.vx * SMEAR * k).toFixed(1));
    g.setAttribute("fy", (s.y - s.vy * SMEAR * k).toFixed(1));
    g.setAttribute("r", r.toFixed(1));
  }, []);

  // one physics step per frame, only while hovered or fading out
  const step = useCallback(
    (_time: number, deltaMs: number) => {
      const s = sim.current;
      const dt = Math.min(deltaMs / 1000, 1 / 30);
      s.t += dt;
      // a slow drift keeps the colour alive when the pointer rests, like the marble's own motion
      const tx = s.tx + Math.sin(s.t * 1.3) * s.w * 0.04;
      const ty = s.ty + Math.cos(s.t * 1.1) * s.h * 0.08;
      s.vx += (STIFFNESS * (tx - s.x) - DAMPING * s.vx) * dt;
      s.vy += (STIFFNESS * (ty - s.y) - DAMPING * s.vy) * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      draw();
    },
    [draw],
  );

  const stop = useCallback(() => {
    if (!sim.current.on) return;
    gsap.ticker.remove(step);
    sim.current.on = false;
  }, [step]);

  useEffect(() => {
    gsap.set(fill.current, { attr: { width: "0" } });
    return () => {
      tl.current?.kill();
      stop();
    };
  }, [stop]);

  /** The wipe in. `at` is where the pointer came in, or nothing for keyboard focus (the glow then sits in the middle). */
  const enter = (el: HTMLElement, at?: { x: number; y: number }) => {
    const rect = el.getBoundingClientRect();
    const s = sim.current;
    s.w = rect.width;
    s.h = rect.height;
    if (at && livePointer()) {
      // the glow is born where the pointer came in
      Object.assign(s, { x: at.x, y: at.y, tx: at.x, ty: at.y, vx: 0, vy: 0 });
      if (!s.on) {
        gsap.ticker.add(step);
        s.on = true;
      }
    } else {
      Object.assign(s, { x: rect.width / 2, y: rect.height / 2, vx: 0, vy: 0 });
    }
    draw();
    const calm = media("(prefers-reduced-motion: reduce)");
    tl.current?.kill();
    tl.current = gsap
      .timeline({ defaults: { duration: calm ? 0.25 : 1, ease: "power2.out" } })
      .set(displacement.current, { attr: { scale: calm ? 0 : 150 } })
      .to(fill.current, { attr: { width: "150%" } }, 0)
      .to(displacement.current, { attr: { scale: calm ? 0 : 40 } }, 0);
  };

  const leave = () => {
    const calm = media("(prefers-reduced-motion: reduce)");
    tl.current?.kill();
    tl.current = gsap
      .timeline({ defaults: { duration: calm ? 0.25 : 1, ease: "power2.out" }, onComplete: stop })
      .to(fill.current, { attr: { width: "0" } }, 0)
      .to(displacement.current, { attr: { scale: 0 }, duration: calm ? 0.25 : 0.5 }, calm ? 0 : 0.5);
  };

  const local = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const Tag: ElementType = as ?? (href ? "a" : "button");
  return (
    <Tag
      href={href}
      className={className ? `hgb ${className}` : "hgb"}
      onMouseEnter={(e: MouseEvent<HTMLElement>) => {
        enter(e.currentTarget, local(e));
        onMouseEnter?.(e as MouseEvent<HTMLAnchorElement>);
      }}
      onMouseMove={(e: MouseEvent<HTMLElement>) => {
        if (sim.current.on) {
          const p = local(e);
          sim.current.tx = p.x;
          sim.current.ty = p.y;
        }
        onMouseMove?.(e as MouseEvent<HTMLAnchorElement>);
      }}
      onMouseLeave={(e: MouseEvent<HTMLElement>) => {
        leave();
        onMouseLeave?.(e as MouseEvent<HTMLAnchorElement>);
      }}
      onFocus={(e: FocusEvent<HTMLElement>) => {
        if (e.currentTarget.matches(":focus-visible")) enter(e.currentTarget);
        onFocus?.(e as FocusEvent<HTMLAnchorElement>);
      }}
      onBlur={(e: FocusEvent<HTMLElement>) => {
        leave();
        onBlur?.(e as FocusEvent<HTMLAnchorElement>);
      }}
      {...rest}
    >
      <svg className="hgb__fx" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-30%" y="-80%" width="200%" height="260%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={4} result="noise" seed={5} />
            <feDisplacementMap ref={displacement} in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <radialGradient id={gradId} ref={glow} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1">
            {STOPS.map((color, i) => (
              <stop key={color} offset={`${(i / (STOPS.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </radialGradient>
        </defs>
        <rect ref={fill} fill={`url(#${gradId})`} x="-25%" y="-20%" width="150%" height="140%" style={{ filter: `url(#${filterId})` }} />
      </svg>
      <span className="hgb__label">
        {children}
        {icon ? <span className="hgb__icon">{icon}</span> : null}
      </span>
    </Tag>
  );
}
```

### 4.2 CSS: append to `src/app/globals.css`

```css
/* HoverGradientButton (components/ui/HoverGradientButton.tsx). Everything is in em, so the whole button scales with its font size:
   at 14.4px it is 45px tall, the size of edith's hero button. The colours are fixed on purpose: a light pill with dark text, so the
   label stays readable while the gradient is only part way across, in either theme. On a dark surface it is exactly edith's
   button. On the light theme's light page a hairline (an inset shadow, so the size does not change and the gradient still covers
   it) keeps the resting pill visible. */
.hgb {
  --hgb-bg: #f5f5f4;
  --hgb-fg: #0c0a09;
  --hgb-edge: transparent;
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3.125em;
  padding: 0 1.25em;
  border: 0;
  border-radius: 999px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: inset 0 0 0 1px var(--hgb-edge);
  background: var(--hgb-bg);
  color: var(--hgb-fg);
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
}
@media (max-width: 649px) {
  .hgb { font-size: 1.04rem; }
}
.hgb:focus-visible {
  outline: 2px solid var(--hgb-bg);
  outline-offset: 3px;
}
.hgb__fx {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.hgb__label {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.9375em;
}
.hgb__icon {
  display: inline-flex;
  height: 1.25em;
}
.hgb__icon svg {
  height: 100%;
  width: auto;
  fill: currentColor;
}

/* the light theme, off a dark scene: a hairline round the resting pill (the portfolio's own --hairline-strong) */
:root[data-theme="light"] .hgb {
  --hgb-edge: var(--hairline-strong, #d6d3d1);
}
:root[data-theme="light"] .scene-dark .hgb {
  --hgb-edge: transparent;
}
```

### 4.3 `src/components/sections/HeroCta.tsx` (new)

A client component, so next-intl's `Link` can be passed to the button without crossing from the server-rendered `Hero`.

```tsx
"use client";

// The hero's one button: edith's hover effect, linking to a page of this site. It is a client component so that next-intl's Link
// (which adds the language prefix) can be handed to the button without crossing from the server-rendered Hero.

import { Link } from "@/i18n/navigation";
import { HoverGradientButton } from "@/components/ui/HoverGradientButton";

/** Material "arrow forward", a filled glyph so it takes the label colour. */
const ARROW = "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z";

export function HeroCta({ href, label }: { href: string; label: string }) {
  return (
    <HoverGradientButton
      as={Link}
      href={href}
      icon={
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={ARROW} />
        </svg>
      }
    >
      {label}
    </HoverGradientButton>
  );
}
```

### 4.4 `src/components/sections/Hero.tsx`

Add the import and a second translator, and put the button in the row that holds the social icons. `SocialIcons` loses its
`-ml-2.5` here because it no longer starts the row (that negative margin only existed to line the icons up with the text edge). Keep
everything else, including the entrance animation on the row.

```tsx
import { HeroCta } from "@/components/sections/HeroCta";

// inside Hero():
const tNav = await getTranslations("nav");

// the row that used to hold only the social icons:
<div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-5" style={enter(620)}>
  <HeroCta href="/contact" label={tNav("contact")} />
  <SocialIcons hoverEffect={false} />
</div>
```

Also update the doc comment above `Hero`, which says the hero has "no CTAs competing with the headline": it now has one quiet
button, and the headline still stands alone.

If a phone wraps the icons under the button, check that they still line up with the text edge; put `-ml-2.5` back on that wrapped row
only if they do not.

## 5. Verify, with evidence

1. `npm run typecheck` and `npm run build` pass, with no hydration warnings in the console. Report the home page's first-load JS
   before and after.
2. Serve it and drive it with Playwright (bundled Chromium is fine, no WebGL needed). At 1440x900 and 390x844, in **dark and light
   theme** (`localStorage.setItem("theme", "light")`, reload), in English and at `/de`: screenshot the resting button, then
   move the mouse in from the left and capture at about 150 ms, 500 ms and 1500 ms, then move fast to the right end and capture
   again, then leave. Look at the frames. Required: a light pill at rest; a wobbly-edged gradient wiping in from the left; the glow
   shifting toward the pointer; the label readable in every frame; no thin light ring around the gradient on the dark page; a visible
   hairline on the light page; the pill clean again after leaving.
3. Keyboard: Tab to the button and the wipe plays with the glow in the middle; Shift+Tab closes it. A mouse click does not play it.
4. Reduced motion (`page.emulateMedia({ reducedMotion: "reduce" })`): the wipe is quick and has no wobble.
5. Touch (`hasTouch`, `isMobile`): a tap plays the wipe centred and goes to `/contact` (`/de/contact` on the German page).
6. Layout: the headline and the paragraph have not moved (compare their bounding boxes before and after), the social icons are
   still present and aligned, and the hero's entrance animation still plays.
7. In Safari and Firefox if you can, otherwise say you could not.
8. Report honestly what you could not check (real devices, other browsers).

## 6. Tell Kevin (do not decide for him)

- **Where the effect came from.** edith's own comment calls its button the "Button 'Base' of the original", and its marble comments
  refer to "the original" WebGL layer too. That reads as taken from a different, original site. Nobody has checked. It is the same
  question as the marble's provenance (checklist item E4 in edith's `web/docs/kevin-todo.md`), worth settling before this goes on a
  public portfolio used for applications.
- **Colour.** The gradient is edith's gold, orange, red and magenta. This portfolio is a warm monochrome with "one drop of colour"
  (`globals.css`). One small button is a mild version of that change; the hero marble would be a large one.
- **A button in the hero at all.** The hero's own comment says it deliberately has no call to action beside the headline. This adds
  one, quietly, because Kevin asked for the effect there. Say so.
- **Label and target** are a default (Contact, `/contact`), see 3.4.
- **Browsers.** Tested in Chromium only.

## 7. Undo

Delete `HoverGradientButton.tsx` and `HeroCta.tsx`, remove the CSS block, revert the `Hero.tsx` edit. Nothing else was touched.
