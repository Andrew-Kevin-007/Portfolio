import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { papers } from "@/content/research";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tm = await getTranslations({ locale, namespace: "pageMeta" });
  return {
    title: t("research"),
    description: tm("research"),
    alternates: localeAlternates(locale, "/research"),
  };
}

const OPEN_QUESTIONS: { q: string; a: string }[] = [
  {
    q: "who owns a refactor?",
    a: "Git credits the last hand to touch a line — so a refactorer quietly inherits authorship of code they never designed. Any provenance system that can't tell restructuring from authorship is measuring the wrong thing.",
  },
  {
    q: "can allocation be fair and efficient under adversarial load?",
    a: "Markets clear efficiently and starve whoever bids lowest; queues are fair and waste everything. The open question is whether a mechanism can price contention without letting the deepest pockets always win — Auctus is one attempt to find out.",
  },
  {
    q: "what does provenance mean when the author is a pipeline?",
    a: "When a model writes the code and a human approves it, neither is cleanly the author. Provenance may have to record a chain of custody — who signed off, under what key — rather than a single name.",
  },
  {
    q: "how much of infrastructure is secretly a pricing problem?",
    a: "More than anyone admits. Rate limits, quotas, priority classes, retry budgets — each is a price refusing to call itself one. See contention as a market and half of infrastructure design turns out to be economics in a trench coat.",
  },
];

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <div className="container-column pt-36 pb-8">
      <header>
        <h1 className="text-display">
          {t("research")}
          <span className="text-text-3">.</span>
        </h1>
        <p className="mt-5 max-w-[56ch] text-lede text-text-2">
          Formal work moves slowly and becomes visible only at the end. This
          page keeps score honestly — <strong>what's under review, what's
          done, and the questions that stay open longer than any paper.</strong>
        </p>
      </header>

      {/* Under review */}
      <section className="mt-20">
        <Reveal>
          <p className="mb-4 text-monosm uppercase text-text-3">Under review</p>
        </Reveal>
        <Reveal>
          <div className="rounded-2xl border border-hairline p-6 sm:p-8">
            <p className="max-w-[58ch] text-bodylg text-text-2">
              A paper on <strong>cloud resource allocation</strong> is
              currently under review. Venue, title, results, and figures stay
              off this page until the process concludes — double-blind review
              is part of the work, not an obstacle to it.
            </p>
            <p className="mt-4 text-monosm text-text-3">
              context → <Link href="/work/auctus" className="underline decoration-hairline-strong underline-offset-4 transition-colors duration-300 hover:text-text-1">the Auctus case study</Link>
            </p>
          </div>
        </Reveal>
      </section>

      {/* Recent work — each paper opens its own detail page */}
      <section className="mt-20">
        <Reveal>
          <p className="mb-4 text-monosm uppercase text-text-3">Recent work</p>
        </Reveal>
        <div>
          {papers.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link
                href={`/research/${p.slug}`}
                className="group block border-t border-hairline py-6 transition-colors duration-300 hover:border-hairline-strong"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="text-title text-text-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                    {p.title}
                  </h2>
                  <span className="shrink-0 text-monosm text-text-3">
                    {p.domain} · {p.status}
                  </span>
                </div>
                <div className="mt-2 flex items-start justify-between gap-6">
                  <p className="max-w-[60ch] text-body text-text-2">
                    {p.oneLiner}
                  </p>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                    className="mt-1 shrink-0 text-text-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-1"
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
              </Link>
            </Reveal>
          ))}
          <div className="border-t border-hairline" />
        </div>
        <Reveal>
          <p className="mt-4 text-monosm text-text-3">
            Full publication list available on request.
          </p>
        </Reveal>
      </section>

      {/* Open questions — the part that matters */}
      <section className="mt-20">
        <Reveal>
          <p className="mb-4 text-monosm uppercase text-text-3">
            Open questions
          </p>
        </Reveal>
        <div>
          {OPEN_QUESTIONS.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.05}>
              <div
                tabIndex={0}
                className="group flex cursor-help items-baseline gap-5 border-t border-hairline py-5 outline-none"
              >
                <span className="text-monosm text-text-3 transition-colors duration-300 group-hover:text-text-2 group-focus-within:text-text-2">
                  q{String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <p className="text-bodylg text-text-1">{item.q}</p>
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="max-w-[62ch] pt-3 text-body text-text-2 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-focus-within:opacity-100">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-hairline" />
        </div>
        <Reveal>
          <p className="mt-4 max-w-[58ch] text-monosm text-text-3">
            linger on a question for where the thinking stands — they outlive any
            answer, though; a good question is a research program wearing modest
            clothes
          </p>
        </Reveal>
      </section>
    </div>
  );
}
