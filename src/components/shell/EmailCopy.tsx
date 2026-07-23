"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { EMAIL } from "@/content/site";

/** kevinandrew2559@gmail.com -> kevi******@gmail.com — enough to read as an
 * email, not enough to hand a scraper the real address. */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 4)}${"*".repeat(6)}@${domain}`;
}

/** Masked email + a button that copies the real address — the button is
 * the only thing that ever hands out the unmasked value. */
export function EmailCopy() {
  const t = useTranslations("aboutPage");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — nothing to fall back to here
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* A <span> has the "generic" role, which prohibits aria-label; the
          masked text reads fine on its own and the button names the action. */}
      <span className="text-bodylg text-text-1">{maskEmail(EMAIL)}</span>
      <button type="button" onClick={handleCopy} className="pill shrink-0">
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2.5 7.3L5.4 10.2L11.5 3.8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <rect
              x="4.5"
              y="4.5"
              width="7"
              height="8"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <path
              d="M2.5 9.5V2.5a1 1 0 0 1 1-1H9"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
        )}
        {copied ? t("copied") : t("copyToClipboard")}
      </button>
    </div>
  );
}
