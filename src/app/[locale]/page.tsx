import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { Manifesto } from "@/components/sections/Manifesto";
import { FeaturedDock } from "@/components/sections/FeaturedDock";
import { Doors } from "@/components/sections/Doors";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: localeAlternates(locale, "/") };
}

/**
 * Home — one narrative line, one dark room throughout, no competing
 * sections: hero → the loop (the operating philosophy) → the featured film
 * docking into hardware → the rooms (each carrying its own live thread) →
 * highlights ("for the nerds" — the blog aside) → outro. Writing has its
 * own page and isn't duplicated here.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Manifesto />
      <FeaturedDock />
      <Doors />
      <Highlights />
    </>
  );
}
