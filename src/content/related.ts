/**
 * Pages that cover the same subject from two sides (a case study and its
 * paper, a project and its research strand). Each side links to the other so
 * crawlers and readers can follow the connection.
 */
export type Related = { href: string; label: string };

export const relatedForStudy: Record<string, Related> = {
  "cb-sjf-work": {
    href: "/research/content-blind-scheduling",
    label: "The paper behind it: Quantifying the Cost of Content-Blindness in LLM Inference Scheduling",
  },
  etch: {
    href: "/research/provenance-for-code",
    label: "The research strand: Provenance for code",
  },
};

export const relatedForPaper: Record<string, Related> = {
  "content-blind-scheduling": {
    href: "/work/cb-sjf-work",
    label: "The engineering case study: CB-SJF-Work",
  },
  "provenance-for-code": {
    href: "/work/etch",
    label: "The project it belongs to: Etch",
  },
};
