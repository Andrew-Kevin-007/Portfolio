import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { EDITH_URL, NAME, SOCIAL, SCHOLAR } from "@/content/site";

/**
 * Official-links directory: every public place that is genuinely Kevin's,
 * one sentence each. Text on purpose — a directory a person (or a crawler)
 * can read, not a wall of icons. The body is English on every route; only
 * the site chrome is translated, so the content is marked lang="en".
 *
 * Instagram and Facebook are left out until their public/private intent is
 * decided. The studio is listed as in development, matching its real state.
 */

const STUDIO_URL = "https://studio-omega-brown.vercel.app";
const WRITING_URL = "https://beyondaphelion.hashnode.dev";

type Item = { label: string; href: string; note: string; internal?: boolean };
type Group = { heading: string; items: Item[] };

const groups: Group[] = [
  {
    heading: "Work and research",
    items: [
      {
        label: "Work",
        href: "/work",
        internal: true,
        note: "Case studies of the systems I have built: Etch, STEM, The Pit and others.",
      },
      {
        label: "Research",
        href: "/research",
        internal: true,
        note: "Papers and the code and data behind them.",
      },
      {
        label: "ORCID",
        href: SCHOLAR.orcid,
        note: "My persistent academic identifier, under the name Kevin Andrew A.",
      },
    ],
  },
  {
    heading: "Profiles",
    items: [
      {
        label: "GitHub",
        href: SOCIAL.github,
        note: "The code: source for the projects and papers on this site.",
      },
      {
        label: "LinkedIn",
        href: SOCIAL.linkedin,
        note: "My professional profile.",
      },
      {
        label: "X",
        href: SOCIAL.x,
        note: "Short updates while I build, under the handle Beyond Aphelion.",
      },
      {
        label: "daily.dev",
        href: SOCIAL.dailydev,
        note: "My developer-community profile and reading list.",
      },
    ],
  },
  {
    heading: "Writing",
    items: [
      {
        label: "Writing",
        href: "/writing",
        internal: true,
        note: "Essays published on this site.",
      },
      {
        label: "Beyond Aphelion on Hashnode",
        href: WRITING_URL,
        note: "Technical articles, published under the Beyond Aphelion name.",
      },
    ],
  },
  {
    heading: "edith",
    items: [
      {
        label: "edith community",
        href: EDITH_URL,
        note: "A builder community I am developing, with AI agents. It is still being built.",
      },
      {
        label: "Edith Studio",
        href: STUDIO_URL,
        note: "A separate creative studio for design, art and technology that I am also developing. It is still being built, and it is not part of the community.",
      },
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tm = await getTranslations({ locale, namespace: "linksMeta" });
  return {
    title: { absolute: tm("title") },
    description: tm("description"),
    alternates: localeAlternates(locale, "/links"),
  };
}

export default async function LinksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div lang="en" className="container-column pt-36 pb-8">
      <header>
        <h1 className="max-w-[18ch] text-display">Official links</h1>
        <p className="mt-6 max-w-[52ch] text-lede text-text-2">
          The places that are genuinely mine, and what each one is. If you are
          looking for {NAME}, who builds cloud systems, protocols and applied AI, start here.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.heading} className="mt-16">
          <Reveal>
            <h2 className="text-monosm uppercase text-text-3">
              {group.heading}
            </h2>
            <ul className="mt-4 flex flex-col gap-5">
              {group.items.map((item) => (
                <li key={item.href}>
                  {item.internal ? (
                    <Link
                      href={item.href}
                      className="text-title text-text-1 transition-colors duration-300 hover:text-text-2"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-title text-text-1 transition-colors duration-300 hover:text-text-2"
                    >
                      {item.label} ↗
                    </a>
                  )}
                  <p className="mt-1 max-w-[58ch] text-body text-text-2">
                    {item.note}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      ))}
    </div>
  );
}
