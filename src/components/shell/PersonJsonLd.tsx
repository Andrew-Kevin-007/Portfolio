import { NAME, SITE_URL, EMAIL, SOCIAL, STUDIO_URL } from "@/content/site";

/**
 * Structured data — server-rendered, single source of truth from site.ts.
 * Person (who) + WebSite (what this domain is), linked by @id so crawlers
 * read them as one graph.
 */
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: NAME,
        url: SITE_URL,
        email: `mailto:${EMAIL}`,
        jobTitle: "Software Engineer",
        worksFor: {
          "@type": "Organization",
          name: "Edith Studio",
          url: STUDIO_URL,
        },
        sameAs: [SOCIAL.github, SOCIAL.linkedin, SOCIAL.x, SOCIAL.instagram],
        knowsAbout: [
          "Cloud Infrastructure",
          "Distributed Systems",
          "Cryptographic Protocols",
          "Applied AI",
          "DevOps",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: NAME,
        url: SITE_URL,
        inLanguage: ["en", "de"],
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
