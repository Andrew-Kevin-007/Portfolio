import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { studies, archive } from "@/content/work";
import { Rich } from "@/lib/rich";
import { EMAIL } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates(locale, "/work"),
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");

  return (
    <div className="container-column pt-36 pb-8">
      <header>
        <h1 className="text-display">
          {t("title")}
          <span className="text-text-3">.</span>
        </h1>
        <p className="mt-5 max-w-[56ch] text-lede text-text-2">
          {t("subtitle")}
        </p>
        {t("languageNote") && (
          <p className="mt-3 text-monosm text-text-3">{t("languageNote")}</p>
        )}
      </header>

      {/* Case studies */}
      <section className="mt-20">
        <Reveal>
          <p className="mb-4 text-monosm uppercase text-text-3">
            {t("topPicks")}
          </p>
        </Reveal>
        <div>
          {studies.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.06}>
              <Link
                href={`/work/${s.slug}`}
                className="group block border-t border-hairline py-8 transition-colors duration-300 hover:border-hairline-strong"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <span className="text-monosm text-text-3">
                    0{i + 1} · {s.domain}
                  </span>
                  <span className="text-monosm text-text-3">{s.years}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-6">
                  <h2 className="text-title text-text-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                    {s.title}
                  </h2>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                    className="shrink-0 text-text-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-1"
                  >
                    <path
                      d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="mt-2 max-w-[62ch] text-body text-text-2">
                  {s.oneLiner}
                </p>
              </Link>
            </Reveal>
          ))}
          <div className="border-t border-hairline" />
        </div>
      </section>

      <Reveal>
        <div className="my-16 flex flex-col items-center gap-4 sm:my-20 sm:flex-row sm:gap-6">
          <span className="hidden h-px flex-1 bg-hairline sm:block" aria-hidden="true" />
          <p className="max-w-[34ch] text-center text-title text-text-3">
            <Rich text={t("transition")} />
          </p>
          <span className="hidden h-px flex-1 bg-hairline sm:block" aria-hidden="true" />
        </div>
      </Reveal>

      {/* Archive */}
      <section id="archive" className="mt-14 scroll-mt-28">
        <Reveal>
          <p className="mb-4 text-monosm uppercase text-text-3">
            {t("archive")}
          </p>
        </Reveal>
        <div>
          {archive.map((a, i) => {
            const rowContent = (
              <>
                <div className="flex items-baseline gap-3">
                  <span
                    className={
                      a.github
                        ? "text-bodylg text-text-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
                        : "text-bodylg text-text-1"
                    }
                  >
                    {a.name}
                  </span>
                  <span className="text-monosm text-text-3">{a.domain}</span>
                  {a.github && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden
                      className="shrink-0 text-text-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-1"
                    >
                      <path
                        d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <p className="max-w-[46ch] text-meta text-text-2 sm:text-right">
                  {a.oneLiner}
                </p>
              </>
            );
            const rowClass =
              "group flex flex-col gap-1 border-t border-hairline py-5 transition-colors duration-300 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6" +
              (a.github ? " hover:border-hairline-strong" : "");

            return (
              <Reveal key={a.name} delay={i * 0.05}>
                {a.github ? (
                  <a
                    href={a.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${a.name} on GitHub`}
                    className={rowClass}
                  >
                    {rowContent}
                  </a>
                ) : (
                  <div className={rowClass}>{rowContent}</div>
                )}
              </Reveal>
            );
          })}
          <div className="border-t border-hairline" />
        </div>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
          <Reveal>
            <p className="text-monosm text-text-3">{t("archiveNote")}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <a
              href={`mailto:${EMAIL}`}
              className="group text-monosm text-text-2 transition-colors duration-300 hover:text-text-1"
            >
              {t("requestDetails")}
              <span className="ml-1 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                →
              </span>
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
