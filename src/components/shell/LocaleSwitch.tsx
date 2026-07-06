"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitch() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: "en" | "de") => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className="flex items-center gap-1 text-meta"
      role="group"
      aria-label={t("language")}
    >
      {(["en", "de"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-text-3/50">/</span>}
          <button
            onClick={() => switchTo(l)}
            aria-current={locale === l ? "true" : undefined}
            className={
              locale === l
                ? "text-text-1"
                : "text-text-3 transition-colors duration-300 hover:text-text-2"
            }
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
