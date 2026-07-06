import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container-column flex min-h-[70svh] flex-col items-start justify-center">
      <p className="text-monosm text-text-3">404</p>
      <h1 className="mt-4 text-display">{t("title")}</h1>
      <p className="mt-4 max-w-[40ch] text-lede text-text-2">{t("body")}</p>
      <Link href="/" className="pill mt-10">
        {t("back")}
      </Link>
    </div>
  );
}
