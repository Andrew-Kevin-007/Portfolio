import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { essays } from "@/content/writing";

/**
 * Writing — the thinker's shelf. Title-scale rows with mono indices,
 * the same interaction physics as every other index on the site.
 */
export async function WritingList() {
  const t = await getTranslations("home");

  return (
    <section className="container-column">
      <Reveal>
        <div className="flex items-end justify-between">
          <h2 className="text-heading">
            {t("writingTitle")}
            <span className="text-text-3">.</span>
          </h2>
          <Link
            href="/writing"
            className="group inline-flex items-center gap-2 pb-1 text-meta text-text-3 transition-colors duration-300 hover:text-text-1"
          >
            {t("writingAll")}
            <span aria-hidden className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </Reveal>

      <div className="mt-8">
        {essays.map((e, i) => (
          <Reveal key={e.slug} delay={i * 0.06}>
            <Link
              href={`/writing/${e.slug}`}
              className="group flex items-baseline justify-between gap-6 border-t border-hairline py-6 transition-colors duration-300 hover:border-hairline-strong"
            >
              <span className="flex items-baseline gap-5 sm:gap-7">
                <span className="text-monosm text-text-3">
                  w0{i + 1}
                </span>
                <span className="text-title text-text-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:text-text-1">
                  {e.title}
                </span>
              </span>
              <span className="hidden shrink-0 text-monosm text-text-3 sm:inline">
                {e.published} · {e.minutes} min
              </span>
            </Link>
          </Reveal>
        ))}
        <div className="border-t border-hairline" />
      </div>
    </section>
  );
}
