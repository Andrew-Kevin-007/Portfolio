import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { studies, getStudy } from "@/content/work";
import { StudyBlocks } from "@/components/sections/StudyBlocks";
import { ProjectLinks } from "@/components/sections/ProjectLinks";
import { Reveal } from "@/components/motion/Reveal";
import { Rich } from "@/lib/rich";

export function generateStaticParams() {
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) return {};
  return { title: study.title, description: study.dek };
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const study = getStudy(slug);
  if (!study) notFound();

  const t = await getTranslations("work");
  const index = studies.findIndex((s) => s.slug === slug);
  const next = studies[(index + 1) % studies.length];

  const tldrRows = [
    { label: t("problem"), text: study.tldr.problem },
    { label: t("approach"), text: study.tldr.approach },
    { label: t("state"), text: study.tldr.state },
  ];

  return (
    <article className="container-column pt-36 pb-8">
      <header>
        <p className="text-monosm text-text-3">
          {study.domain} · {study.years}
        </p>
        <h1 className="mt-4 text-display">{study.title}</h1>
        <p className="mt-5 max-w-[58ch] text-lede text-text-2">{study.dek}</p>
        {t("languageNote") && (
          <p className="mt-3 text-monosm text-text-3">{t("languageNote")}</p>
        )}
        <ProjectLinks
          github={study.github}
          live={study.live}
          viewSourceLabel={t("viewSource")}
          tryItOutLabel={t("tryItOut", { name: study.name })}
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
              <div key={row.label} className="sm:grid sm:grid-cols-[110px_1fr] sm:gap-6">
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
        <StudyBlocks blocks={study.blocks} nextLabel={t("nextLabel")} />
      </section>

      {/* Next project */}
      <nav className="mt-24 border-t border-hairline pt-8">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/work"
            className="text-meta text-text-3 transition-colors duration-300 hover:text-text-1"
          >
            ← {t("backToWork")}
          </Link>
          <Link href={`/work/${next.slug}`} className="group text-right">
            <p className="text-monosm uppercase text-text-3">{t("nextLabel")}</p>
            <p className="mt-1 text-title text-text-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1.5">
              {next.title}
            </p>
          </Link>
        </div>
      </nav>
    </article>
  );
}
