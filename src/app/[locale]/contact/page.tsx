import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Reveal } from "@/components/motion/Reveal";
import { EMAIL, SOCIAL } from "@/content/site";
import { Clock } from "@/components/shell/Clock";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tm = await getTranslations({ locale, namespace: "pageMeta" });
  return {
    title: t("contact"),
    description: tm("contact"),
    alternates: localeAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");

  return (
    <div className="container-column pt-36 pb-8">
      <header>
        <h1 className="max-w-[16ch] text-display">{t("title")}</h1>
        <p className="mt-6 max-w-[52ch] text-lede text-text-2">{t("body")}</p>
        <Reveal delay={0.05}>
          <p className="mt-5 inline-flex items-center gap-2.5 text-monosm text-text-2">
            <span aria-hidden>🟢</span>
            {t("availability")}
          </p>
        </Reveal>
      </header>

      <section className="mt-16">
        <Reveal>
          <p className="text-monosm uppercase text-text-3">{t("emailLabel")}</p>
          <a
            href={`mailto:${EMAIL}`}
            className="group mt-3 inline-block text-heading text-text-1"
          >
            {t("emailCta")}
            <span className="mt-1 block h-px w-full origin-left scale-x-0 bg-text-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </a>
        </Reveal>
      </section>

      <section className="mt-16 grid gap-10 sm:grid-cols-2">
        <Reveal>
          <p className="text-monosm uppercase text-text-3">
            {t("elsewhereLabel")}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href={SOCIAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-text-2 transition-colors duration-300 hover:text-text-1"
            >
              GitHub ↗
            </a>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-text-2 transition-colors duration-300 hover:text-text-1"
            >
              LinkedIn ↗
            </a>
            <a
              href={SOCIAL.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-text-2 transition-colors duration-300 hover:text-text-1"
            >
              {t("cvLabel")} ↗
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-monosm uppercase text-text-3">
            {t("localTimeLabel")}
          </p>
          <p className="mt-3 text-body text-text-2">
            <Clock />
          </p>
        </Reveal>
      </section>
    </div>
  );
}
