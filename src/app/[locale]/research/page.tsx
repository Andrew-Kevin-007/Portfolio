import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("research") };
}

const OPEN_QUESTIONS = [
  "who owns a refactor?",
  "can allocation be fair and efficient under adversarial load?",
  "what does provenance mean when the author is a pipeline?",
  "how much of infrastructure is secretly a pricing problem?",
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

      {/* Recent work */}
      <section className="mt-20">
        <Reveal>
          <p className="mb-4 text-monosm uppercase text-text-3">Recent work</p>
        </Reveal>
        <div>
          <Reveal>
            <div className="border-t border-hairline py-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-title">Clinical risk prediction</h2>
                <span className="text-monosm text-text-3">applied ML</span>
              </div>
              <p className="mt-2 max-w-[60ch] text-body text-text-2">
                Pressure-ulcer risk modeling with{" "}
                <a
                  href="https://scikit-learn.org/stable/modules/ensemble.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-hairline-strong underline-offset-4 transition-colors duration-300 hover:text-text-1 hover:decoration-text-3"
                >
                  ensemble methods
                </a>{" "}
                — audited end to end and rebuilt where the audit demanded it.
              </p>
              <p className="mt-3 text-monosm text-text-3">
                ensemble accuracy 87.62% ·{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Receiver_operating_characteristic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-hairline-strong underline-offset-4 transition-colors duration-300 hover:text-text-1"
                >
                  AUC-ROC
                </a>{" "}
                88.67%
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="border-t border-hairline py-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-title">Provenance for code</h2>
                <span className="text-monosm text-text-3">protocol design</span>
              </div>
              <p className="mt-2 max-w-[60ch] text-body text-text-2">
                The research half of Etch: what a checkable claim of authorship
                requires, and how small the trusted surface can get.
              </p>
              <p className="mt-3 text-monosm text-text-3">
                spec in progress → <Link href="/work/etch" className="underline decoration-hairline-strong underline-offset-4 transition-colors duration-300 hover:text-text-1">case study</Link>
              </p>
            </div>
          </Reveal>
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
          {OPEN_QUESTIONS.map((q, i) => (
            <Reveal key={q} delay={i * 0.05}>
              <div className="flex items-baseline gap-5 border-t border-hairline py-5">
                <span className="text-monosm text-text-3">
                  q{String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-bodylg text-text-1">{q}</p>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-hairline" />
        </div>
        <Reveal>
          <p className="mt-4 max-w-[58ch] text-monosm text-text-3">
            these outlive papers — a good question is a research program wearing
            modest clothes
          </p>
        </Reveal>
      </section>
    </div>
  );
}
