"use client";

import { useEffect, useState } from "react";

function localNow(): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(new Date());
}

/** Live clock in the visitor's own timezone — a small proof the site is alive. */
export function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(localNow());
    const id = setInterval(() => setTime(localNow()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Render a stable placeholder on the server to avoid hydration mismatch
  return <span suppressHydrationWarning>{time ?? "——:——"}</span>;
}
