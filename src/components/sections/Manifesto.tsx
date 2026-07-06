import { getTranslations } from "next-intl/server";
import { ScrollFill } from "@/components/studio/ScrollFill";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The manifesto band — the operating loop, stated once, in ink that arrives
 * as you read it. Same dark room as the rest of the house.
 */
export async function Manifesto() {
  const t = await getTranslations("home");

  return (
    <section className="overflow-x-clip">
      <div className="container-column py-32 text-center sm:py-44">
        <Reveal>
          <p className="text-monosm uppercase text-text-3">
            {t("manifestoLabel")}
          </p>
        </Reveal>
        <ScrollFill
          className="mx-auto mt-10 max-w-[26ch] text-heading text-text-1"
          text={t("manifesto")}
        />
      </div>
    </section>
  );
}
