"use client";

import { useState } from "react";

/**
 * Expander — a single disclosure, same accordion physics as the studio FAQ:
 * content unfolds on the 0fr → 1fr grid trick (no height measurement), a
 * plus that folds into a minus. Styled as a pill trigger rather than a row,
 * since this is for one-off "worth a second look" content, not a list.
 */
export function Expander({
  label,
  openLabel,
  children,
}: {
  label: string;
  openLabel?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="pill-ghost"
      >
        {open ? (openLabel ?? label) : label}
        <span aria-hidden className="relative h-3 w-3 shrink-0">
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
          <span
            className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateX(-50%) scaleY(${open ? 0 : 1})` }}
          />
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
