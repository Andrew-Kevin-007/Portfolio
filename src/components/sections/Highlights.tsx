import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { studies } from "@/content/work";

/**
 * Highlights — a quick pull of the three flagship case studies, right after
 * the hero and before the loop states the operating principle behind them.
 * Same border-t row rhythm as Doors further down, so the two "lists of
 * links" on this page read as one visual language, not two components.
 */
export async function Highlights() {
  const t = await getTranslations("home");

  return (
    <section>
      <div className="container-column py-28 sm:py-36">
        <Reveal>
          <p className="text-monosm uppercase text-text-3">
            {t("selectWork")}
          </p>
        </Reveal>
        <Reveal>
          <h2 className="mt-4 max-w-[22ch] text-heading text-text-1">
            {t("workKeynote")}
            <span className="text-text-3">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-5 max-w-[56ch] text-bodylg text-text-2">
            {t.rich("workKeynoteBody", {
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </Reveal>

        <div className="mt-10">
          {studies.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.06}>
              <Link
                href={`/work/${s.slug}`}
                className="group flex items-center justify-between gap-8 border-t border-hairline py-8 transition-colors duration-300 hover:border-hairline-strong"
              >
                <span>
                  <span className="block text-title text-text-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                    {s.title}
                  </span>
                  <span className="mt-2 block max-w-[52ch] text-body text-text-2">
                    {s.oneLiner}
                  </span>
                </span>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                  className="shrink-0 text-text-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-text-1"
                >
                  <path
                    d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Reveal>
          ))}
          <div className="border-t border-hairline" />
        </div>

        <Reveal delay={0.1}>
          <Link
            href="/work"
            className="group mt-8 inline-flex items-center gap-1.5 text-monosm text-text-3 transition-colors duration-300 hover:text-text-1"
          >
            {t("allWork")}
            <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
