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
  dailydev: "https://daily.dev/beyondaphelion",
  cv: "/kevin-andrew-cv.pdf",
} as const;

/**
 * Scholarly identifiers — the authoritative, machine-readable nodes that
 * separate this Kevin Andrew from the namesakes (an artist, a novelist, an
 * Amazon author) who already occupy the name on the open web. Consumer
 * social links cannot do that job; an ORCID iD can.
 *
 * Each stays "" until the profile actually exists. The schema builder drops
 * falsy entries, so an unset id is simply absent rather than a dead sameAs —
 * same honesty rule the content registries live by.
 */
export const SCHOLAR = {
  orcid: "",
  googleScholar: "",
  semanticScholar: "",
  dblp: "",
} as const;

/**
 * Identity facts asserted in structured data. Kept here, beside the URLs, so
 * there is exactly one place to correct them.
 */
export const JOB_TITLE = "Software Engineer";
export const DESCRIPTION =
  "Kevin Andrew builds cloud infrastructure, protocols, and applied AI — designed from first principles and shipped end to end.";
export const ALUMNI_OF = "Loyola-ICAM College of Engineering and Technology";
export const NATIONALITY = "India";
export const LOCALITY = "Chennai";
export const REGION = "Tamil Nadu";

export const STUDIO_URL = "https://edithstudio.vercel.app";
