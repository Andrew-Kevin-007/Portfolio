/**
 * Research registry — papers and formal work, each with its own detail page
 * at /research/[slug]. Mirrors content/work.ts and reuses its block system.
 *
 * HONESTY RULES (same as work.ts):
 * - No fabricated metrics, datasets, venues, or sample sizes. Only facts
 *   already stated on the site are asserted as fact; everything the author
 *   has to supply is marked [CONFIRM] and reads as an explicit open state,
 *   never as a fake number.
 * - Links (PDF, code) stay undefined until each is verified live.
 */

import type { StudyBlock } from "@/content/work";

export type Paper = {
  slug: string;
  title: string;
  domain: string;
  /** short status word for the card + header: "complete", "in progress" … */
  status: string;
  /** one line for the recent-work list */
  oneLiner: string;
  /** the lede on the detail page */
  dek: string;
  tldr: { problem: string; approach: string; findings: string };
  blocks: StudyBlock[];
  /** verified links only — omitted until live */
  pdf?: string;
  github?: string;
};

export const papers: Paper[] = [
  {
    slug: "content-blind-scheduling",
    title: "Quantifying the Cost of Content-Blindness in LLM Inference Scheduling",
    domain: "cloud scheduling",
    status: "accepted",
    oneLiner:
      "What LLM inference scheduling loses when it can't read the prompt — measured on 44.1M real Azure production requests, and it's less than the literature assumed.",
    dek: "Every serious fix for head-of-line blocking in LLM serving reads the prompt to guess how long the response will be. This paper asks what a scheduler forfeits when it can't — and finds the answer smaller than expected.",
    tldr: {
      problem:
        "**Predicting response length from prompt text is the standard fix for head-of-line blocking in LLM serving — and exactly what a privacy-constrained platform can't do.** Whether anything is actually lost by not reading the prompt had never been measured directly.",
      approach:
        "**44.1 million real requests from Microsoft Azure's production LLM inference traces**, split into a conversation and a code workload. Service work decomposes into an observable prefill component (fixed by context length) and an unobservable decode component — the paper measures how much of each there actually is, then evaluates CB-SJF-Work, a scheduler that orders admissions on the observable part alone.",
      findings:
        "**Prefill is 91.2% and 98.7% of attributable marginal work** in the two traces — the component a content-blind scheduler CAN see is the larger one. CB-SJF-Work cuts mean normalised latency by 51.5% and 58.8% against first-come-first-serve, recovering 90.3% and 79.3% of what a perfect-information oracle attains — at a measured tail-latency cost the paper reports rather than hides.",
    },
    blocks: [
      { kind: "h2", text: "The problem" },
      {
        kind: "p",
        text: "Continuous-batching inference engines hold a request's slot for as long as it takes to generate its response, so one long-generating request admitted early blocks many short ones behind it. The standard literature answer is to predict output length from the prompt and approximate shortest-job-first. **That requires reading the user's prompt** — a genuine obstacle for a platform under data-protection obligations or offering confidential-computing guarantees.",
      },
      {
        kind: "p",
        text: "The question underneath the constraint hadn't been answered empirically: **how much of the achievable scheduling benefit is actually locked inside the prompt?**",
      },
      { kind: "h2", text: "Approach" },
      {
        kind: "p",
        text: "The paper analyses the [Azure LLM Inference Trace 2024](https://github.com/Azure/AzurePublicDataset) — 44.1 million real production requests across a conversation and a code workload — and decomposes service work into a prefill pass (proportional to context length, visible at admission) and a decode phase (proportional to output length, not visible until the request completes). It then evaluates **CB-SJF-Work**, ordering admissions by estimated total work using only context length and arrival metadata, benchmarked against first-come-first-serve and against oracles with perfect output-length knowledge.",
      },
      {
        kind: "quote",
        text: "For these workloads the information a scheduler is denied is largely the information it least needs.",
        cite: "paper abstract",
      },
      { kind: "h2", text: "Findings" },
      {
        kind: "stats",
        items: [
          { label: "Prefill share — conversation", value: "91.2%", note: "of attributable marginal work" },
          { label: "Prefill share — code", value: "98.7%", note: "of attributable marginal work" },
          { label: "Latency cut — conversation", value: "51.5%", note: "mean normalised latency vs. FCFS" },
          { label: "Latency cut — code", value: "58.8%", note: "mean normalised latency vs. FCFS" },
          { label: "Oracle gap closed — conversation", value: "90.3%", note: "of the attainable improvement" },
          { label: "Oracle gap closed — code", value: "79.3%", note: "of the attainable improvement" },
        ],
      },
      {
        kind: "p",
        text: "Two findings qualify the headline. The gain **is paid for in the tail** — 99th-percentile latency degrades by up to 3.1× at high load on the code workload, a cost an oracle scheduler also incurs, isolated to the act of leaving arrival order rather than to shortest-first ordering itself. And a **learned content-blind length predictor earns almost nothing** over simply ordering by raw context length — a negative result the paper states rather than omits.",
      },
      {
        kind: "p",
        text: "Co-authored with [Kavita Sri](https://github.com/KavitaSri06), Dept. of Information Technology, LICET.",
      },
      {
        kind: "next",
        text: "Code releases on acceptance, per the paper. The open problem it leaves standing is prefix-cache-aware content-blind scheduling — multi-turn conversation traffic serves repeated prefixes from cache, and the traces used here record context length but not cache residency, so the current result can't answer what that does.",
      },
    ],
  },
  {
    slug: "clinical-risk-prediction",
    title: "Clinical risk prediction",
    domain: "applied ML",
    status: "complete",
    oneLiner:
      "Pressure-ulcer risk modeling with ensemble methods — audited end to end and rebuilt where the audit demanded it.",
    dek: "A pressure-ulcer risk model built to be honest about its own numbers: ensemble methods, measured on the metric that survives class imbalance, and audited before any accuracy figure was allowed to stand.",
    tldr: {
      problem:
        "**Clinical risk models are easy to overstate.** On imbalanced data — most patients don't develop the condition — a model can score high on raw accuracy while being close to useless at the thing that matters: flagging the patients actually at risk.",
      approach:
        "**Ensemble methods, audited end to end.** The model was scored on [AUC-ROC](https://en.wikipedia.org/wiki/Receiver_operating_characteristic), not accuracy alone, and every stage — from split to metric — was checked for the usual failure modes before a single number was reported.",
      findings:
        "**Ensemble accuracy 87.62%, AUC-ROC 88.67%.** Reported together on purpose: the AUC-ROC is the figure that holds up under class imbalance, and it's the one the audit trusts.",
    },
    blocks: [
      { kind: "h2", text: "The problem" },
      {
        kind: "p",
        text: "Pressure-ulcer risk prediction is a genuinely useful thing to get right — the condition is common, costly, and largely preventable when the at-risk patients are flagged early. It's also a textbook trap for machine learning: **the positive class is rare**, so a model that predicts \"no risk\" for everyone can post a high accuracy and be clinically worthless.",
      },
      {
        kind: "p",
        text: "That gap — between a number that looks good and a model that helps — is the whole problem. The work was as much about **not fooling yourself** as it was about the model.",
      },
      { kind: "h2", text: "Approach" },
      {
        kind: "p",
        text: "The model uses [ensemble methods](https://scikit-learn.org/stable/modules/ensemble.html) — combining several weaker learners so no single one's blind spot decides the outcome. But the method was the smaller half of the work. The larger half was the **audit**: checking the split for leakage, checking whether the headline metric survived the class imbalance, and rebuilding the pipeline wherever it didn't.",
      },
      {
        kind: "quote",
        text: "A model that only looks good on the metric that flatters it hasn't been evaluated — it's been marketed.",
        cite: "audit notes",
      },
      { kind: "h2", text: "Findings" },
      {
        kind: "stats",
        items: [
          {
            label: "Ensemble accuracy",
            value: "87.62%",
            note: "raw accuracy across the test set",
          },
          {
            label: "AUC-ROC",
            value: "88.67%",
            note: "the figure that holds under class imbalance",
          },
          {
            label: "Method",
            value: "ensemble",
            note: "several learners, no single blind spot",
          },
        ],
      },
      {
        kind: "p",
        text: "The two numbers are reported side by side deliberately. **Accuracy alone would be the misleading one** on data this imbalanced; the AUC-ROC is what says the model actually separates the at-risk patients from the rest — and it's the figure the audit signs off on.",
      },
      // [CONFIRM] once the paper/PDF is public, set `pdf` above and rewrite
      // this line to point at it.
      {
        kind: "next",
        text: "The full methodology — dataset handling, the specific audit checks, and the write-up — is **available on request**.",
      },
    ],
  },
  {
    slug: "provenance-for-code",
    title: "Provenance for code",
    domain: "protocol design",
    status: "in progress",
    oneLiner:
      "The research half of Etch: what a checkable claim of authorship requires, and how small the trusted surface can get.",
    dek: "The formal strand behind Etch — treating authorship as something that should be checkable the way a checksum is, and asking how little you have to trust to make that true.",
    tldr: {
      problem:
        "**Git history is testimony, not proof.** Commits can be rebased, amended, and forged. As machines write more of the code, the question of who wrote what gets both harder and more consequential — and there's no artifact you can point to that settles it.",
      approach:
        "**Make authorship checkable, and shrink what you have to trust.** Content-addressed, signed authorship claims that verify as a pure function — no authority in the loop — with the trusted surface kept small enough to audit.",
      findings:
        "**Spec stabilizing in public.** This is the design-research strand; the engineering strand ships as [Etch](/work/etch). The open questions below outlive any single write-up.",
    },
    blocks: [
      { kind: "h2", text: "The question" },
      {
        kind: "p",
        text: "What does it actually take for a claim of authorship to be **checkable** — locally, instantly, without trusting the person making the claim? The research half of Etch starts there, before any code: it treats provenance as a verification problem, not a database problem.",
      },
      {
        kind: "p",
        text: "The design constraint that makes it interesting is minimality. **How small can the trusted surface get** before verification stops meaning anything? Every dependency you add to the checker is something a verifier has to trust — so the interesting version of the problem pushes that surface toward zero.",
      },
      {
        kind: "quote",
        text: "A claim of authorship should be checkable the way a checksum is checkable — locally, instantly, without trusting the person making the claim.",
        cite: "design note, etch spec draft",
      },
      { kind: "h2", text: "Where it stands" },
      {
        kind: "p",
        text: "The engineering strand ships as the [Etch case study](/work/etch) — a Rust core, ed25519-signed content-addressed claims, edge-deployed verification. This page is the **research** strand: the questions underneath the implementation, written down in public as the spec stabilizes.",
      },
      {
        kind: "next",
        text: "The spec is being written in the open. The load-bearing work is making it precise enough that someone else can implement a verifier from it without asking questions.",
      },
    ],
  },
];

export const getPaper = (slug: string) => papers.find((p) => p.slug === slug);
