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
  orcid: "https://orcid.org/0009-0007-0631-5563",
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
/**
 * One person, three legally-correct spellings. Passport reads given name
 * "Kevin Andrew", surname "Arockia Arasu"; mark sheets and every government
 * document read "Kevin Andrew A"; the site brand is "Kevin Andrew"; and the
 * publication byline is "Kevin Andrew A".
 *
 * None of these can be changed, so they are DECLARED instead. schema.org
 * exists for exactly this: givenName/familyName carry the legal name and
 * alternateName carries every string a crawler might encounter, so the
 * variants resolve to one Person rather than splitting into three weak ones.
 * This matters here because the name is already held on the open web by a
 * namesake artist and a novelist.
 */
export const GIVEN_NAME = "Kevin Andrew";
export const FAMILY_NAME = "Arockia Arasu";
/** The byline on both papers — the string the DOIs will carry. */
export const PUBLISHED_NAME = "Kevin Andrew A";
export const NAME_VARIANTS = [PUBLISHED_NAME, "Kevin Andrew Arockia Arasu"];

/** Confirmed from the camera-ready byline, not inferred. */
export const INSTITUTION = "Loyola-ICAM College of Engineering and Technology";
export const DEPARTMENT = "Department of Information Technology";
export const NATIONALITY = "India";
export const LOCALITY = "Chennai";
export const REGION = "Tamil Nadu";

export const STUDIO_URL = "https://edithstudio.vercel.app";
