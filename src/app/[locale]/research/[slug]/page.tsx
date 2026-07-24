import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { papers, getPaper } from "@/content/research";
import { StudyBlocks } from "@/components/sections/StudyBlocks";
import { ProjectLinks } from "@/components/sections/ProjectLinks";
import { Reveal } from "@/components/motion/Reveal";
import { Rich } from "@/lib/rich";
import { localeAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return papers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const paper = getPaper(slug);
  if (!paper) return {};
  return {
    title: paper.title,
    description: paper.dek,
    alternates: localeAlternates(locale, `/research/${slug}`),
  };
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const paper = getPaper(slug);
  if (!paper) notFound();

  const index = papers.findIndex((p) => p.slug === slug);
  const next = papers[(index + 1) % papers.length];

  const tldrRows = [
    { label: "Problem", text: paper.tldr.problem },
    { label: "Approach", text: paper.tldr.approach },
    { label: "Findings", text: paper.tldr.findings },
  ];

  return (
    <article className="container-column pt-36 pb-8">
      <header>
        <p className="text-monosm text-text-3">
          {paper.domain} · {paper.status}
        </p>
        <h1 className="mt-4 text-display">{paper.title}</h1>
        <p className="mt-5 max-w-[58ch] text-lede text-text-2">{paper.dek}</p>
        <ProjectLinks
          github={paper.github}
          live={paper.pdf}
          viewSourceLabel="View source"
          tryItOutLabel="Read the paper"
        />
      </header>

      {/* TL;DR — scannable in twenty seconds */}
      <Reveal>
        <section
          className="mt-14 rounded-2xl border border-hairline p-6 sm:p-8"
          style={{
            background:
              "color-mix(in srgb, var(--bg-elevated) 55%, transparent)",
          }}
        >
          <div className="space-y-6">
            {tldrRows.map((row) => (
              <div
                key={row.label}
                className="sm:grid sm:grid-cols-[110px_1fr] sm:gap-6"
              >
                <p className="text-monosm uppercase text-text-3">{row.label}</p>
                <p className="mt-1 max-w-[58ch] text-body text-text-2 sm:mt-0">
                  <Rich text={row.text} />
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="mt-6">
        <StudyBlocks blocks={paper.blocks} nextLabel="Next" />
      </section>

      {/* Next paper */}
      <nav className="mt-24 border-t border-hairline pt-8">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/research"
            className="text-meta text-text-3 transition-colors duration-300 hover:text-text-1"
          >
            ← All research
          </Link>
          {next.slug !== paper.slug && (
            <Link href={`/research/${next.slug}`} className="group text-right">
              <p className="text-monosm uppercase text-text-3">Next</p>
              <p className="mt-1 text-title text-text-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1.5">
                {next.title}
              </p>
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
