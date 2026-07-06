import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { NAME, SITE_URL } from "@/content/site";

/**
 * The share card — same system as the site: stone dark, one weight,
 * the tagline at display scale, a quiet dotted field. Localized.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = NAME;

const TAGLINE: Record<string, [string, string]> = {
  en: ["I build quiet systems", "for loud problems."],
  de: ["Ich baue leise Systeme", "für laute Probleme."],
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [l1, l2] = TAGLINE[locale] ?? TAGLINE.en;

  const font = await readFile(
    join(process.cwd(), "src/fonts/google-sans-flex-og.woff")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0c0a09",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #292524 1px, transparent 0)",
          backgroundSize: "56px 56px",
          fontFamily: "Google Sans Flex",
          color: "#f5f5f4",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#a8a29e" }}>
          {NAME}
          <span style={{ color: "#8a857f" }}>.</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
          }}
        >
          <span>{l1}</span>
          <span>{l2}</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#8a857f",
          }}
        >
          <span>{SITE_URL.replace("https://", "")}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Google Sans Flex",
          data: font,
          weight: 500,
          style: "normal",
        },
      ],
    }
  );
}
