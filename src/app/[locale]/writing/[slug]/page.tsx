import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { essays, getEssay } from "@/content/writing";
import { Rich } from "@/lib/rich";
import { Reveal } from "@/components/motion/Reveal";

export function generateStaticParams() {
  return essays.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) return {};
  return { title: essay.title, description: essay.description };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const essay = getEssay(slug);
  if (!essay) notFound();

  const index = essays.findIndex((e) => e.slug === slug);
  const next = essays[(index + 1) % essays.length];

  return (
    <article className="container-column pt-36 pb-8">
      <header>
        <p className="text-monosm text-text-3">
          {essay.published} · {essay.minutes} min
        </p>
        <h1 className="mt-4 max-w-[24ch] text-display">{essay.title}</h1>
      </header>

      <div className="mt-14 space-y-6">
        {essay.content.map((block, i) => {
          if (block.type === "standout") {
            return (
              <Reveal key={i}>
                <p className="max-w-[30ch] py-3 text-title text-text-1">
                  <Rich text={block.text} />
                </p>
              </Reveal>
            );
          }
          if (block.type === "inner") {
            return (
              <Reveal key={i}>
                <p className="max-w-[52ch] border-l border-hairline pl-5 text-body text-text-3">
                  <Rich text={block.text} />
                </p>
              </Reveal>
            );
          }
          return (
            <Reveal key={i}>
              <p className="max-w-[56ch] text-bodylg text-text-2">
                <Rich text={block.text} />
              </p>
            </Reveal>
          );
        })}
      </div>

      <nav className="mt-24 border-t border-hairline pt-8">
        <Link href={`/writing/${next.slug}`} className="group block text-right">
          <p className="text-monosm uppercase text-text-3">Next</p>
          <p className="mt-1 text-title text-text-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1.5">
            {next.title}
          </p>
        </Link>
      </nav>
    </article>
  );
}
