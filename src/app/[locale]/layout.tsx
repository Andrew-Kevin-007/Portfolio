import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Nav } from "@/components/shell/Nav";
import { Footer } from "@/components/shell/Footer";
import { PersonJsonLd } from "@/components/shell/PersonJsonLd";
import { NAME, SITE_URL } from "@/content/site";
import "../globals.css";

// Self-hosted (no external fonts.googleapis.com round trip — that render-blocking
// request was the cause of the white flash-of-unstyled-content on cold loads).
// Both are single variable-weight woff2 files covering 400–500 for latin.
const sans = localFont({
  src: "../../fonts/google-sans-flex-latin.woff2",
  variable: "--font-sans-loaded",
  display: "swap",
  weight: "400 500",
});
const mono = localFont({
  src: "../../fonts/google-sans-code-latin.woff2",
  variable: "--font-mono-loaded",
  display: "swap",
  weight: "400 500",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s — ${NAME}` },
    description: t("description"),
    alternates: { canonical: "./" },
    openGraph: {
      siteName: NAME,
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_US",
    },
    robots: { index: true, follow: true },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before paint so the stored/preferred theme applies with no flash —
// the <html> tag below still needs a default for the no-JS/pre-hydration case.
const THEME_INIT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important}`}</style>
        </noscript>
      </head>
      <body>
        <PersonJsonLd />
        <NextIntlClientProvider>
          <SmoothScroll>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
