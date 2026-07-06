import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The rooms — navigation and news folded into one object: each room that
 * has a live thread carries it as a pulsing status line, so you don't visit
 * a separate "currently" section to find out what's active right now.
 * The Studio room and Edith Studio's name carry the intelligence gradient —
 * the one drop of color on the homepage. Same dark room as the rest of the
 * house — no contrast banding.
 */
const DOORS = [
  {
    href: "/research",
    titleKey: "doorsResearchTitle",
    bodyKey: "doorsResearchBody",
    intel: false,
    statusKey: "now2",
    statusIntel: false,
  },
  {
    href: "/studio",
    titleKey: "doorsStudioTitle",
    bodyKey: "doorsStudioBody",
    intel: true,
    statusKey: "now3",
    statusIntel: true,
  },
  {
    href: "/writing",
    titleKey: "doorsWritingTitle",
    bodyKey: "doorsWritingBody",
    intel: false,
    statusKey: null,
    statusIntel: false,
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
          {DOORS.map(({ href, titleKey, bodyKey, intel, statusKey, statusIntel }, i) => (
            <Reveal key={href} delay={i * 0.07}>
              <Link
                href={href}
                className="group flex items-center justify-between gap-8 border-t border-hairline py-10 transition-colors duration-300 hover:border-hairline-strong"
              >
                <span>
                  <span className="block text-heading transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                    {intel ? (
                      <span className="text-intel">{t(titleKey)}</span>
                    ) : (
                      <span className="text-text-1">{t(titleKey)}</span>
                    )}
                    <span className="text-text-3">.</span>
                  </span>
                  <span className="mt-3 block max-w-[48ch] text-bodylg text-text-2">
                    {t(bodyKey)}
                  </span>
                  {statusKey && (
                    <span className="mt-5 flex items-center gap-2.5 text-monosm text-text-3">
                      <span className="live-dot" aria-hidden />
                      <span>
                        {t.rich(statusKey, {
                          b: (chunks) =>
                            statusIntel ? (
                              <span className="text-intel">{chunks}</span>
                            ) : (
                              <strong>{chunks}</strong>
                            ),
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
              </Link>
            </Reveal>
          ))}
          <div className="border-t border-hairline" />
        </div>
      </div>
    </section>
  );
}
