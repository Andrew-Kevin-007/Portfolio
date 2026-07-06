import { getTranslations } from "next-intl/server";
import { Parallax } from "@/components/studio/Parallax";
import { SocialIcons } from "@/components/shell/SocialIcons";

const enter = (delay: number) => ({
  animation: "page-in 0.9s cubic-bezier(0.16,1,0.3,1) both",
  animationDelay: `${delay}ms`,
});

/**
 * Hero — the statement stands alone. No eyebrow line, no CTAs competing
 * with the headline; the only action offered is "go look at my work
 * elsewhere" via the social row, since Featured and Rooms carry the CTAs
 * further down the page.
 */
export async function Hero() {
  const t = await getTranslations("home");

  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden">
      {/* counter-drift on exit — the room stays, the words leave first */}
      <Parallax speed={-0.07} className="relative w-full">
        <div className="container-column pt-32 pb-24">
          <h1 className="text-display md:text-[clamp(3rem,5.8vw,4.3rem)] md:leading-[1.05] md:tracking-[-0.025em]">
            <span className="line-mask">
              <span style={{ ["--line-delay" as string]: "100ms" }}>
                {t("heroL1")}
              </span>
            </span>
            <span className="line-mask">
              <span style={{ ["--line-delay" as string]: "220ms" }}>
                {t("heroL2")}
              </span>
            </span>
          </h1>

          <p
            className="mt-9 max-w-[58ch] text-lede text-text-2"
            style={enter(450)}
          >
            {t.rich("lede", {
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>

          <div className="mt-11" style={enter(620)}>
            <SocialIcons className="-ml-2.5" hoverEffect={false} />
          </div>
        </div>
      </Parallax>
    </section>
  );
}
