import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { essays } from "@/content/writing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tm = await getTranslations({ locale, namespace: "pageMeta" });
  return {
    title: t("writing"),
    description: tm("writing"),
    alternates: localeAlternates(locale, "/writing"),
  };
}

export default async function WritingPage({
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
          {t("writing")}
          <span className="text-text-3">.</span>
        </h1>
        <p className="mt-5 max-w-[52ch] text-lede text-text-2">
          Notes to myself, published. Mostly about the gap between who you are
          and what you're building.
        </p>
      </header>

      <div className="mt-16">
        {essays.map((e, i) => (
          <Reveal key={e.slug} delay={i * 0.06}>
            <Link
              href={`/writing/${e.slug}`}
              className="group block border-t border-hairline py-7 transition-colors duration-300 hover:border-hairline-strong"
            >
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="text-title text-text-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                  {e.title}
                </h2>
                <span className="shrink-0 text-monosm text-text-3">
                  {e.published} · {e.minutes} min
                </span>
              </div>
              <p className="mt-2 max-w-[60ch] text-body text-text-2">
                {e.description}
              </p>
            </Link>
          </Reveal>
        ))}
        <div className="border-t border-hairline" />
      </div>
    </div>
  );
}
