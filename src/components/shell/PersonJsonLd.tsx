import {
  NAME,
  SITE_URL,
  EMAIL,
  SOCIAL,
  SCHOLAR,
  STUDIO_URL,
  JOB_TITLE,
  DESCRIPTION,
  GIVEN_NAME,
  NAME_VARIANTS,
  INSTITUTION,
  DEPARTMENT,
  NATIONALITY,
  LOCALITY,
  REGION,
} from "@/content/site";

/**
 * Structured data — server-rendered, single source of truth from site.ts.
 *
 * Three nodes, linked by @id so crawlers read one graph rather than three
 * unrelated blobs:
 *   #person   who this is                (sitewide, in the layout)
 *   #studio   the org he works for       (sitewide, in the layout)
 *   #website  what this domain is        (home page only — see WebSiteJsonLd)
 *   ProfilePage                          (/about only — see ProfilePageJsonLd)
 *
 * The hard problem this markup exists to solve is not description, it is
 * DISAMBIGUATION. "Kevin Andrew" is two common first names and is already
 * held on the open web by an artist and a novelist. A Person node is only
 * as good as the authoritative identifiers hanging off it, which is why
 * SCHOLAR ids matter more here than any amount of consumer social.
 */

/** Drop empty ids so an unset profile is absent, never a dead sameAs. */
const sameAs = () =>
  [
    SOCIAL.github,
    SOCIAL.linkedin,
    SOCIAL.x,
    SOCIAL.instagram,
    SOCIAL.facebook,
    SOCIAL.dailydev,
    SCHOLAR.orcid,
    SCHOLAR.googleScholar,
    SCHOLAR.semanticScholar,
    SCHOLAR.dblp,
  ].filter(Boolean);

const personNode = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: NAME,
  // No familyName — there isn't one, and ORCID's family-name field is blank
  // for the same reason. givenName carries the whole name; alternateName
  // carries the publication byline, so the site's "Kevin Andrew" and the
  // papers' "Kevin Andrew A" resolve to one person rather than two.
  givenName: GIVEN_NAME,
  alternateName: NAME_VARIANTS,
  url: SITE_URL,
  email: `mailto:${EMAIL}`,
  image: `${SITE_URL}/logos/site-logo.png`,
  description: DESCRIPTION,
  jobTitle: JOB_TITLE,
  worksFor: { "@id": `${SITE_URL}/#studio` },
  // affiliation, not alumniOf — still enrolled. This is also the string on
  // both paper bylines, so it is the join between the site and the DOIs.
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: INSTITUTION,
    department: { "@type": "Organization", name: DEPARTMENT },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressCountry: "IN",
    },
  },
  nationality: { "@type": "Country", name: NATIONALITY },
  address: {
    "@type": "PostalAddress",
    addressLocality: LOCALITY,
    addressRegion: REGION,
    addressCountry: "IN",
  },
  knowsAbout: [
    "Cloud Infrastructure",
    "Distributed Systems",
    "Cryptographic Protocols",
    "Applied AI",
    "DevOps",
  ],
  sameAs: sameAs(),
};

const studioNode = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#studio`,
  name: "Edith Studio",
  url: STUDIO_URL,
  founder: { "@id": `${SITE_URL}/#person` },
};

function ld(data: unknown) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Sitewide identity. Rendered once, in the layout. */
export function PersonJsonLd() {
  return ld({
    "@context": "https://schema.org",
    "@graph": [personNode, studioNode],
  });
}

/**
 * WebSite belongs on the home page only — emitting it on all 36 URLs told
 * crawlers every page was the site root.
 */
export function WebSiteJsonLd() {
  return ld({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: NAME,
    url: SITE_URL,
    inLanguage: ["en", "de"],
    publisher: { "@id": `${SITE_URL}/#person` },
    about: { "@id": `${SITE_URL}/#person` },
  });
}

/**
 * /about is a textbook ProfilePage — the one page type Google documents for
 * "this page is about a person", and the natural home for the Person node.
 */
export function ProfilePageJsonLd() {
  return ld({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about#profilepage`,
    url: `${SITE_URL}/about`,
    name: `About — ${NAME}`,
    mainEntity: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  });
}
