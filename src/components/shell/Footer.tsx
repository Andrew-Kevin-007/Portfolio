import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAME, SOCIAL } from "@/content/site";
import { SocialIcons } from "./SocialIcons";
import { Clock } from "./Clock";

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");

  return (
    <footer className="mt-32 border-t border-hairline sm:mt-40">
      <div className="container-column py-12 sm:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <p className="text-body text-text-1">
              {NAME}
              <span className="text-text-3">.</span>
            </p>
            <SocialIcons className="-ml-2.5" hoverEffect={false} />
          </div>

          <div className="flex gap-14">
            <nav
              className="flex flex-col gap-2 text-meta"
              aria-label="Footer"
            >
              {(
                [
                  ["/work", "work"],
                  ["/research", "research"],
                  ["/studio", "studio"],
                  ["/writing", "writing"],
                ] as const
              ).map(([href, key]) => (
                <Link
                  key={key}
                  href={href}
                  className="text-text-3 transition-colors duration-300 hover:text-text-1"
                >
                  {tn(key)}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 text-meta">
              <a
                href={SOCIAL.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-3 transition-colors duration-300 hover:text-text-1"
              >
                {t("cv")}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-monosm text-text-3">
            {t("rights")} · {t("built")}
          </p>
          <p className="text-monosm text-text-3">
            <Clock />
          </p>
        </div>
      </div>
    </footer>
  );
}
