import { NAME, SITE_URL, EMAIL, SOCIAL } from "@/content/site";

/** Person schema — server-rendered, single source of truth from site.ts */
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: NAME,
    url: SITE_URL,
    email: `mailto:${EMAIL}`,
    sameAs: [SOCIAL.github, SOCIAL.linkedin],
    knowsAbout: [
      "Cloud Infrastructure",
      "Distributed Systems",
      "Cryptographic Protocols",
      "Applied AI",
      "DevOps",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
