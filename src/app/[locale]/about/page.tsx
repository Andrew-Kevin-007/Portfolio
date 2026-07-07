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
  return { title: t("about") };
}

const STOPS = [
  { key: "stop1", org: "Edith Studio", href: "/studio" },
  { key: "stop2", org: "Bluestock" },
  { key: "stop3", org: "SmartBridge × Google" },
  { key: "stop4", org: "Radiant Intelligence" },
] as const;

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
        <p className="mt-6 max-w-[58ch] text-lede text-text-2">
          {t.rich("short", { b: (chunks) => <strong>{chunks}</strong> })}
        </p>
      </header>

      {/* How I work — one throughline story, not cards */}
      <section className="mt-24">
        <Reveal>
          <h3 className="max-w-[18ch] text-heading text-text-1">
            {t("howHeading")}
            <span className="text-text-3">.</span>
          </h3>
        </Reveal>
        <div className="mt-8 space-y-6">
          <Reveal delay={0.06}>
            <p className="max-w-[58ch] text-bodylg text-text-2">
              {t("how1")}
            </p>
          </Reveal>
          <Reveal delay={0.09}>
            <p className="max-w-[58ch] text-bodylg text-text-2">
              {t.rich("how2", {
                studio: (chunks) => (
                  <Link href="/studio" className="text-intel">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <Link
              href="/work/etch"
              className="group my-2 flex items-center justify-between gap-6 border-y border-hairline py-6 transition-colors duration-300 hover:border-hairline-strong"
            >
              <span className="max-w-[52ch] text-title text-text-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                {t("how3")}
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

          <Reveal delay={0.15}>
            <p className="max-w-[58ch] text-bodylg text-text-2">
              {t("how4")}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="max-w-[58ch] text-bodylg text-text-2">
              {t("how5")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Rooms — a timeline of stops, not an abstraction */}
      <section className="mt-24">
        <Reveal>
          <h3 className="max-w-[18ch] text-heading text-text-1">
            {t("roomsHeading")}
            <span className="text-text-3">.</span>
          </h3>
        </Reveal>

        <div className="mt-10 space-y-10">
          {STOPS.map((s, i) => (
            <Reveal key={s.key} delay={0.06 + i * 0.05}>
              <div>
                <h4 className="text-title text-text-1">
                  {"href" in s ? (
                    <Link href={s.href} className="whitespace-nowrap text-intel">
                      {s.org}
                    </Link>
                  ) : (
                    <span className="whitespace-nowrap">{s.org}</span>
                  )}
                </h4>
                <p className="mt-2 max-w-[56ch] text-bodylg text-text-2">
                  {t(`${s.key}Body`)}
                </p>
              </div>
            </Reveal>
          ))}
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
