/**
 * Single source of truth for identity + config.
 * Domain-agnostic by design: change SITE_URL once when the domain is final.
 */

// Primary host is www: Vercel serves the site at www.kevinandrew.tech and
// 308-redirects the bare apex (kevinandrew.tech) to it. Canonical/hreflang/OG
// must therefore use www so they are self-referential and don't point at a
// redirecting URL (which Lighthouse flags as an invalid canonical).
export const SITE_URL = "https://www.kevinandrew.tech";
export const NAME = "Kevin Andrew";
export const EMAIL = "kevinandrew2559@gmail.com";

export const SOCIAL = {
  github: "https://github.com/Andrew-Kevin-007",
  linkedin: "https://www.linkedin.com/in/kevinandrewa/",
  x: "https://x.com/beyondaphelion7",
  instagram: "https://www.instagram.com/beyond.aphelion_/",
  facebook: "https://www.facebook.com/profile.php?id=100029972854839",
  cv: "/kevin-andrew-cv.pdf",
} as const;

export const STUDIO_URL = "https://edithstudio.vercel.app";
