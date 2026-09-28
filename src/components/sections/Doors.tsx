import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { EDITH_URL } from "@/content/site";
import { DoorMarble } from "./DoorMarble";
import { WipeText } from "./WipeText";

/**
 * The rooms — navigation and news folded into one object: each room that
 * has a live thread carries it as a pulsing status line, so you don't visit
 * a separate "currently" section to find out what's active right now.
 * Edith lives on its own external site, so its door is the one external link
 * in the list, and the one that lights up: hovering it reveals the marble behind
 * the row and wipes edith's gradient across its name. Same dark room as the
 * rest of the house — no contrast banding.
 */
const DOORS = [
  {
    href: "/research",
    titleKey: "doorsResearchTitle",
    bodyKey: "doorsResearchBody",
    subKey: null,
    statusKey: "now2",
    external: false,
    marble: false,
  },
  {
    href: EDITH_URL,
    titleKey: "doorsEdithTitle",
    bodyKey: "doorsEdithBody",
    subKey: "doorsEdithSub",
    statusKey: null,
    external: true,
    marble: true,
  },
  {
    href: "/writing",
    titleKey: "doorsWritingTitle",
    bodyKey: "doorsWritingBody",
    subKey: null,
    statusKey: null,
    external: false,
    marble: false,
  },
] as const;

export async function Doors() {
  const t = await getTranslations("home");

  return (
    <section>
      <div className="container-column py-28 sm:py-36">
        <Reveal>
          <p className="text-monosm uppercase text-text-3">{t("doorsLabel")}</p>
        </Reveal>

        <div className="mt-10">
          {DOORS.map(
            ({ href, titleKey, bodyKey, subKey, statusKey, external, marble }, i) => {
              const doorClassName = `group flex items-center justify-between gap-8 border-t border-hairline py-10 transition-colors duration-300 hover:border-hairline-strong${
                marble ? " door-lit relative isolate" : ""
              }`;
              const content = (
                <>
                  {marble && <DoorMarble />}
                  <span>
                    <span className="block text-heading transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                      <span className="text-text-1">
                        {marble ? <WipeText>{t(titleKey)}</WipeText> : t(titleKey)}
                      </span>
                      <span className="text-text-3">.</span>
                    </span>
                    <span className="mt-3 block max-w-[48ch] text-bodylg text-text-2">
                      {t(bodyKey)}
                    </span>
                    {subKey && (
                      <span className="mt-2 block text-monosm text-text-3">
                        {t(subKey)}
                      </span>
                    )}
                    {statusKey && (
                      <span className="mt-5 flex items-center gap-2.5 text-monosm text-text-3">
                        <span className="live-dot" aria-hidden />
                        <span>
                          {t.rich(statusKey, {
                            b: (chunks) => <strong>{chunks}</strong>,
                          })}
                        </span>
                      </span>
                    )}
                  </span>
                  <svg
                    width="26"
                    height="26"
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
                </>
              );

              return (
                <Reveal key={href} delay={i * 0.07}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={doorClassName}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link href={href} className={doorClassName}>
                      {content}
                    </Link>
                  )}
                </Reveal>
              );
            }
          )}
          <div className="border-t border-hairline" />
        </div>
      </div>
    </section>
  );
}
