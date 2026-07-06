import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { Manifesto } from "@/components/sections/Manifesto";
import { FeaturedDock } from "@/components/sections/FeaturedDock";
import { Doors } from "@/components/sections/Doors";

/**
 * Home — one narrative line, one dark room throughout, no competing
 * sections: hero → highlights (the three flagship case studies) → the loop
 * → the featured film docking into hardware → the rooms (each carrying its
 * own live thread) → outro. Writing has its own page and isn't duplicated
 * here.
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
      <Highlights />
      <Manifesto />
      <FeaturedDock />
      <Doors />
    </>
  );
}
