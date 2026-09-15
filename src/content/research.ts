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
    slug: "indic-kg-population",
    title: "Translation Repairs Relations, Not Retrieval",
    domain: "multilingual NLP",
    status: "accepted",
    oneLiner:
      "A pre-registered study of what translation does and does not fix when populating Wikidata from eight Indic languages.",
    dek: "Populating a knowledge base from low-resource text fails in two different ways, and standard evaluation scores them as one number. This paper separates them, then tests whether translating to English fixes either.",
    tldr: {
      problem:
        "**Populating Wikidata from low-resource language text fails in two distinct ways, and a monolithic triple score cannot tell them apart.** A model can fail to understand the source sentence, or it can understand it perfectly and still fail to name the canonical identifier of an entity it has only ever seen written in another script.",
      approach:
        "**Two open 8B models, eight Indic languages, two arms.** Qwen3-8B and Llama-3.1-8B-Instruct run DIRECT and PIVOT (translate first via IndicTrans2, then extract), scored component by component so every error is attributable either to relation identification or to entity grounding. The hypothesis, the decision thresholds and the outcome-to-claim mapping were frozen in a version-controlled pre-registration before any model output was scored.",
      findings:
        "**Translation repairs relations. It does not repair retrieval.** Relation-F1 improves for Qwen3-8B in all eight languages and for Llama-3.1-8B-Instruct in seven of eight. Entity grounding yields no verdict-eligible gap, and for Qwen3-8B translation makes grounding measurably worse.",
    },
    blocks: [
      { kind: "h2", text: "The question" },
      {
        kind: "p",
        text: "Knowledge bases like Wikidata get populated from text, and in low-resource languages that process fails often. The interesting part is that it fails for two unrelated reasons. **A model can fail to understand the source sentence, or it can understand it perfectly and still fail to ground what it understood into a canonical identifier.**",
      },
      {
        kind: "p",
        text: "Standard evaluation cannot tell you which one happened. Extracted triples are scored monolithically, so a missed triple never says whether the model misread the sentence or simply could not name the Wikidata identifier of an entity it had only seen in another script. The conflation is expensive because **the two failures call for opposite remedies**: better multilingual pretraining addresses the first and does nothing for the second.",
      },
      { kind: "h2", text: "Approach" },
      {
        kind: "p",
        text: "Eight Indic languages (Hindi, Bengali, Telugu, Tamil, Kannada, Malayalam, Marathi, Gujarati) plus an English control. Between them they are spoken by over a billion people and remain low-resource by knowledge-base coverage. Two open 8B-class instruction-tuned models, Qwen3-8B and Llama-3.1-8B-Instruct, each run in a DIRECT arm and in a PIVOT arm that translates to English first.",
      },
      {
        kind: "p",
        text: "The benchmark was built by reversing the manually annotated test split of XAlign, a fact-to-text alignment resource for Indic languages, and deterministically re-grounding its English fact labels into Wikidata identifiers. Then the benchmark itself was audited, because a measuring instrument of unknown accuracy is not evidence.",
      },
      { kind: "h2", text: "Decisions" },
      {
        kind: "decision",
        title: "The verdict was frozen before the scoring",
        body: "The hypothesis, its decision thresholds and the mapping from outcome to claim were committed to a version-controlled pre-registration before a single model output was scored. That commit ordering is the whole defence: nobody can have chosen the threshold that made the result look good, because the threshold existed first.",
      },
      {
        kind: "decision",
        title: "Score the components, not the triple",
        body: "Every error is attributed to relation identification or to entity grounding by construction, rather than collapsed into a single number. This is the only reason the headline finding can exist at all, because it is a statement about which half of the problem translation actually touches.",
      },
      {
        kind: "decision",
        title: "Audit the instrument before trusting it",
        body: "Predictions absent from the gold were cross-checked against live Wikidata, with a screened native-speaker check for one language on top. That puts a quantified floor under how incomplete the adapted gold is: at most 4.8% of them are in fact true in the live knowledge base, pooled at 1.3%. Roughly a fifth of predictions never enter that classification at all, because they lack a resolvable subject, property or object identifier, and the paper reports that rather than quietly excluding it.",
      },
      { kind: "h2", text: "Findings" },
      {
        kind: "stats",
        items: [
          { label: "Relation-F1, Qwen3-8B", value: "8/8", note: "languages improved by translating first" },
          { label: "Relation-F1, Llama-3.1-8B", value: "7/8", note: "languages improved, one did not" },
          { label: "Entity-F1, Qwen3-8B", value: "7/8", note: "languages got worse under translation" },
        ],
      },
      {
        kind: "p",
        text: "The verdict is mixed and the paper says so plainly. The confirmation criterion runs over the five Qwen3-8B languages that have a measurable baseline gap. All five move in the hypothesised direction, giving an exact one-sided sign test of p = .031, **which does not survive the conservative family correction applied across the decision table.**",
      },
      {
        kind: "p",
        text: "Entity grounding never produces a verdict at all, for two different reasons worth separating. Qwen3-8B has no measurable gap left to recover, and Llama-3.1-8B-Instruct's four usable languages fall below the five-language bar the pre-registration set in advance.",
      },
      {
        kind: "p",
        text: "The Qwen3-8B entity result is the one worth sitting with. Translation makes grounding worse, and decomposing the archived candidates attributes that to **retrieval rather than selection**: once the correct entity is retrieved at all, the model picks it in 92.9% to 99.5% of calls. Llama-3.1-8B-Instruct does not replicate the pattern, and its retrieval direction inverts.",
      },
      {
        kind: "quote",
        text: "A model can understand a translated sentence perfectly and still be unable to name the identifier of an entity it has only ever seen written in another script.",
        cite: "on why the two failure modes need opposite fixes",
      },
      {
        kind: "p",
        text: "Accepted at SPELLL 2026, Track 7, for publication by Springer in CCIS.",
      },
      {
        kind: "next",
        text: "The benchmark, the audit protocol and the evaluation harness are committed for release, and the links go up once there is something citable to point at. The half of the problem translation does not touch, canonicalizing an entity across scripts, is the one worth attacking next.",
      },
    ],
  },
  {
    slug: "content-blind-scheduling",
    title: "Quantifying the Cost of Content-Blindness in LLM Inference Scheduling",
    domain: "cloud scheduling",
    status: "accepted",
    github: "https://github.com/Andrew-Kevin-007/content-blind-scheduling",
    oneLiner:
      "What LLM inference scheduling loses when it cannot read the prompt, measured on 44.1M real Azure production requests. It is less than the literature assumed.",
    dek: "Every serious fix for head-of-line blocking in LLM serving reads the prompt to guess how long the response will be. This paper asks what a scheduler forfeits when it cannot, and finds the answer smaller than expected.",
    tldr: {
      problem:
        "**Predicting response length from prompt text is the standard fix for head-of-line blocking in LLM serving, and exactly what a privacy-constrained platform cannot do.** Whether anything is actually lost by not reading the prompt had never been measured directly.",
      approach:
        "**44.1 million real requests from Microsoft Azure's production LLM inference traces**, split into a conversation and a code workload. Service work decomposes into an observable prefill component (fixed by context length) and an unobservable decode component. The paper measures how much of each there actually is, then evaluates CB-SJF-Work, a scheduler that orders admissions on the observable part alone.",
      findings:
        "**Prefill is 91.2% and 98.7% of attributable marginal work** in the two traces, so the component a content-blind scheduler can see is the larger one. CB-SJF-Work cuts mean normalised latency by 51.5% and 58.8% against first-come-first-serve, recovering 90.3% and 79.3% of what a perfect-information oracle attains, at a measured tail-latency cost the paper reports rather than hides.",
    },
    blocks: [
      { kind: "h2", text: "The problem" },
      {
        kind: "p",
        text: "Continuous-batching inference engines hold a request's slot for as long as it takes to generate its response, so one long-generating request admitted early blocks many short ones behind it. The standard literature answer is to predict output length from the prompt and approximate shortest-job-first. **That requires reading the user's prompt**, which is a genuine obstacle for a platform under data-protection obligations or offering confidential-computing guarantees.",
      },
      {
        kind: "p",
        text: "The question underneath the constraint had not been answered empirically: **how much of the achievable scheduling benefit is actually locked inside the prompt?**",
      },
      { kind: "h2", text: "Approach" },
      {
        kind: "p",
        text: "The paper analyses the [Azure LLM Inference Trace 2024](https://github.com/Azure/AzurePublicDataset), 44.1 million real production requests across a conversation and a code workload, and decomposes service work into a prefill pass (proportional to context length, visible at admission) and a decode phase (proportional to output length, not visible until the request completes). It then evaluates **CB-SJF-Work**, ordering admissions by estimated total work using only context length and arrival metadata, benchmarked against first-come-first-serve and against oracles with perfect output-length knowledge.",
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
          { label: "Prefill share, conversation", value: "91.2%", note: "of attributable marginal work" },
          { label: "Prefill share, code", value: "98.7%", note: "of attributable marginal work" },
          { label: "Latency cut, conversation", value: "51.5%", note: "mean normalised latency vs. FCFS" },
          { label: "Latency cut, code", value: "58.8%", note: "mean normalised latency vs. FCFS" },
          { label: "Oracle gap closed, conversation", value: "90.3%", note: "of the attainable improvement" },
          { label: "Oracle gap closed, code", value: "79.3%", note: "of the attainable improvement" },
        ],
      },
      {
        kind: "p",
        text: "Two findings qualify the headline. The gain **is paid for in the tail**: 99th-percentile latency degrades by up to 3.1x at high load on the code workload, a cost an oracle scheduler also incurs, and one isolated to the act of leaving arrival order rather than to shortest-first ordering itself. And a **learned content-blind length predictor earns almost nothing** over simply ordering by raw context length, a negative result the paper states rather than omits.",
      },
      {
        kind: "p",
        text: "Accepted at IC3IoT 2026, Track 4 (Blockchain, Cloud Computing and Big Data Analytics), 24 to 25 September 2026. Co-authored with [Kavita Sri](https://github.com/KavitaSri06).",
      },
      {
        kind: "next",
        text: "The simulator, the analysis code, the generated figures and the LaTeX tables are public, and the whole run reproduces in a few minutes on CPU. The open problem it leaves standing is prefix-cache-aware content-blind scheduling: multi-turn conversation traffic serves repeated prefixes from cache, and the traces used here record context length but not cache residency, so the current result cannot answer what that does.",
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
