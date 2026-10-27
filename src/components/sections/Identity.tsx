import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

const BUILDS = [
  { slug: "etch", name: "Etch", key: "etch" },
  { slug: "stem", name: "STEM", key: "stem" },
  { slug: "the-pit", name: "The Pit", key: "pit" },
] as const;

const PAPERS = [
  {
    slug: "content-blind-scheduling",
    title: "Quantifying the Cost of Content-Blindness in LLM Inference Scheduling",
    key: "paper1",
  },
  {
    slug: "indic-kg-population",
    title: "Decomposing the Low-Resource Penalty in Indic Knowledge Graph Population",
    key: "paper2",
  },
] as const;

const linkClass =
  "border-b border-hairline-strong text-text-1 transition-colors duration-300 hover:border-text-1";

/**
 * A plain statement of who this is and what exists. The hero carries the
 * voice; this section carries the facts a reader or a crawler needs to tell
 * this Kevin Andrew from anyone else with the name: the projects and the
 * papers, by name, linked.
 */
export async function Identity() {
  const t = await getTranslations("identity");

  return (
    <section className="border-t border-hairline">
      <div className="container-column py-24 sm:py-32">
        <Reveal>
          <p className="text-monosm uppercase text-text-3">{t("label")}</p>
          <h2 className="mt-6 max-w-[22ch] text-heading text-text-1">
            {t("heading")}
          </h2>
          <p className="mt-6 max-w-[58ch] text-bodylg text-text-2">
            {t("intro")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {BUILDS.map((b, i) => (
            <Reveal key={b.slug} delay={0.05 * i}>
              <h3 className="text-title text-text-1">
                <Link href={`/work/${b.slug}`} className={linkClass}>
                  {b.name}
                </Link>
              </h3>
              <p className="mt-3 text-body text-text-2">{t(b.key)}</p>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3 className="mt-20 text-monosm uppercase text-text-3">
            {t("papersLabel")}
          </h3>
          <p className="mt-4 max-w-[58ch] text-body text-text-2">
            {t("papersIntro")}
          </p>
          <ul className="mt-8 space-y-6">
            {PAPERS.map((p) => (
              <li key={p.slug} className="max-w-[62ch]">
                <Link href={`/research/${p.slug}`} className={linkClass}>
                  {p.title}
                </Link>
                <p className="mt-2 text-body text-text-2">{t(p.key)}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
