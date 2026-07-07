import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { Expander } from "@/components/motion/Expander";
import { EmailCopy } from "@/components/shell/EmailCopy";

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
  { key: "stop4", org: "Raditon Intelligence" },
] as const;

const EXPECT_NOTICES = [
  "expectNotice1",
  "expectNotice2",
  "expectNotice3",
  "expectNotice4",
  "expectNotice5",
] as const;

const AFTER_HOURS_GIFS = [
  "/gifs/juventus.gif",
  "/gifs/art-create.gif",
  "/gifs/beer-reaction.gif",
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

        <div className="mt-8 space-y-6">
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
                <p className="mt-1.5 max-w-[56ch] text-bodylg text-text-2">
                  {t(`${s.key}Body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What you can expect — heading, full-width paragraph, then two
          columns: the tells on the left, the contact block on the right */}
      <section className="mt-24">
        <Reveal>
          <h3 className="max-w-[20ch] text-heading text-text-1">
            {t("expectHeading")}
            <span className="text-text-3">.</span>
          </h3>
        </Reveal>

        <Reveal delay={0.04}>
          <p className="mt-8 max-w-[62ch] text-bodylg text-text-2">
            {t("expectBody")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-16">
          <Reveal delay={0.08}>
            <div>
              <h4 className="text-title text-text-1">
                {t("expectNoticeIntro")}
              </h4>
              <ul className="mt-5 space-y-3">
                {EXPECT_NOTICES.map((k, i) => (
                  <li
                    key={k}
                    className="flex items-baseline gap-3 text-body text-text-2"
                  >
                    <span className="text-monosm text-text-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="border-l border-hairline pl-8 sm:pl-10">
              <p className="text-title text-text-1">
                {t("expectContactLabel")}
              </p>
              <div className="mt-5">
                <EmailCopy />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* After Hours — looser rhythm on purpose: this is the section that's
          allowed to feel like a person instead of a résumé */}
      <section className="mt-24">
        <Reveal>
          <h3 className="max-w-[16ch] text-heading text-text-1">
            {t("afterHoursHeading")}
            <span className="text-text-3">.</span>
          </h3>
        </Reveal>
        <Reveal delay={0.03}>
          <p className="mt-4 max-w-[52ch] text-title text-text-1">
            {t("afterHoursTag")}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-4 max-w-[60ch] text-bodylg text-text-2">
            {t("afterHoursBody")}
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-4 sm:gap-5">
          {AFTER_HOURS_GIFS.map((src, i) => (
            <Reveal key={src} delay={0.1 + i * 0.04}>
              <div className="group h-24 w-24 shrink-0 overflow-hidden border border-hairline transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:h-28 sm:w-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover grayscale transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Outro — the page closes quietly, tucked behind a note instead of
          shouting on the way out */}
      <section className="mt-24 mb-4">
        <Reveal>
          <h3 className="max-w-[18ch] text-heading text-text-1">
            {t("outroHeading")}
            <span className="text-text-3">.</span>
          </h3>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8">
            <Expander
              label={t("outroButtonLabel")}
              openLabel={t("outroButtonOpenLabel")}
            >
              <div className="max-w-[56ch]">
                <p className="text-bodylg leading-relaxed text-text-2">
                  {t.rich("outroBody", {
                    i: (chunks) => <em className="italic">{chunks}</em>,
                    b: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p className="mt-7 text-heading italic text-text-1">
                  {t("outroSeeYou")}
                </p>
                <div className="mt-6 flex items-end gap-4">
                  <span className="pb-2 text-title font-medium text-text-3">
                    —
                  </span>
                  <span className="font-script text-[clamp(3.25rem,10vw,5.25rem)] leading-[0.8] text-text-1 opacity-60">
                    {t("outroSign")}
                  </span>
                </div>
                <p className="mt-6 text-monosm lowercase tracking-wide text-text-3">
                  {t("outroPs")}
                </p>
              </div>
            </Expander>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
