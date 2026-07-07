import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";

const BLOG_URL =
  "https://beyondaphelion.hashnode.dev/the-biggest-misconception-about-rag-it-s-not-just-chatgpt-pdfs";

/**
 * Highlights — "for the nerds": a quiet aside after the case studies,
 * pointing at the blog for anyone who read this far. One line, one link,
 * no list to maintain.
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
            {t("workKeynoteBody")}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-1.5 text-monosm text-text-3 transition-colors duration-300 hover:text-text-1"
          >
            {t("allWork")}
            <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
