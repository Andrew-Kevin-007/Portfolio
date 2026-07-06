import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("about") };
}

const FIELDWORK = [
  { org: "BlueStock", domain: "fintech" },
  { org: "Smartbridge × Google", domain: "generative AI" },
  { org: "Raditon Intelligence", domain: "applied AI" },
  { org: "Infosys Springboard", domain: "SaaS" },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tn = await getTranslations("nav");
  const t = await getTranslations("aboutPage");

  return (
    <div className="container-column pt-36 pb-8">
      <header>
        <h1 className="text-display">
          {tn("about")}
          <span className="text-text-3">.</span>
        </h1>
        <p className="mt-6 max-w-[58ch] text-lede text-text-2">{t("short")}</p>
      </header>

      {/* How I work — keynote stanzas, not cards */}
      <section className="mt-24">
        <Reveal>
          <p className="text-monosm uppercase text-text-3">{t("howLabel")}</p>
        </Reveal>
        <div className="mt-8 space-y-14">
          {([1, 2, 3] as const).map((n, i) => (
            <Reveal key={n} delay={i * 0.05}>
              <div>
                <h3 className="max-w-[20ch] text-title">
                  {t(`how${n}t`)}
                  <span className="text-text-3">.</span>
                </h3>
                <p className="mt-3 max-w-[52ch] text-bodylg text-text-2">
                  {t(`how${n}b`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Rooms — leadership, worn lightly */}
      <section className="mt-24">
        <Reveal>
          <p className="text-monosm uppercase text-text-3">{t("roomsLabel")}</p>
          <p className="mt-8 max-w-[56ch] text-bodylg text-text-2">
            {t.rich("rooms", { b: (chunks) => <strong>{chunks}</strong> })}
          </p>
        </Reveal>
      </section>

      {/* Fieldwork */}
      <section className="mt-24">
        <Reveal>
          <p className="mb-1 text-monosm uppercase text-text-3">
            {t("fieldworkLabel")}
          </p>
          <p className="mb-4 text-meta text-text-2">{t("fieldworkNote")}</p>
        </Reveal>
        <div>
          {FIELDWORK.map((f, i) => (
            <Reveal key={f.org} delay={i * 0.04}>
              <div className="flex items-baseline justify-between gap-6 border-t border-hairline py-4">
                <span className="text-body text-text-1">{f.org}</span>
                <span className="text-monosm text-text-3">{f.domain}</span>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-hairline" />
        </div>
      </section>

      {/* Elsewhere */}
      <section className="mt-24">
        <Reveal>
          <p className="mb-4 text-monosm uppercase text-text-3">
            {t("elsewhereLabel")}
          </p>
        </Reveal>
        <div className="space-y-3">
          {(["el1", "el2", "el3"] as const).map((k, i) => (
            <Reveal key={k} delay={i * 0.05}>
              <p className="max-w-[56ch] text-bodylg text-text-2">{t(k)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trajectory */}
      <section className="mt-24">
        <Reveal>
          <p className="mb-4 text-monosm uppercase text-text-3">
            {t("trajectoryLabel")}
          </p>
          <p className="text-monosm text-text-2">{t("trajectory")}</p>
        </Reveal>
      </section>
    </div>
  );
}
