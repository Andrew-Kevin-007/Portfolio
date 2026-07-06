/**
 * Work registry — flagship case studies + selected archive.
 *
 * HONESTY RULES (enforced):
 * - No fabricated metrics. Anything unverified carries [CONFIRM] and renders
 *   as an explicit "in progress" state, never as a fake number.
 * - Auctus is under double-blind review: no venue name, no paper title,
 *   no figures from the submission. The restraint is deliberate and stated.
 * - Archive entries ship without external links until each link is verified live.
 */

export type StudyBlock =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "quote"; text: string; cite?: string }
  | { kind: "decision"; title: string; body: string }
  | { kind: "stats"; items: { label: string; value: string; note: string }[] }
  | { kind: "next"; text: string };

export type CaseStudy = {
  slug: string;
  name: string;
  domain: string;
  years: string;
  title: string;
  dek: string;
  oneLiner: string;
  tldr: { problem: string; approach: string; state: string };
  blocks: StudyBlock[];
  /** Omitted until the repo/demo is public and verified live — see honesty rules above. */
  github?: string;
  live?: string;
};

export const studies: CaseStudy[] = [
  {
    slug: "etch",
    name: "Etch",
    domain: "Protocol",
    years: "2025–",
    title: "A receipt layer for code",
    dek: "Etch is a cryptographic provenance protocol — authorship that survives the AI era, verifiable by construction.",
    oneLiner:
      "Cryptographic provenance for code. Who wrote what, provable — even when machines write most of it.",
    tldr: {
      problem:
        "**Git history is a social record, not a proof.** Commits can be rewritten, authorship amended, timestamps forged — and AI-generated code makes the question of who wrote what both harder and more consequential.",
      approach:
        "**A signing and verification protocol** — a Rust core that binds authorship to content cryptographically, with an edge-deployed verification layer that answers in milliseconds anywhere.",
      state:
        "**Open-core, in active development.** Core signing and verification under construction; spec being written in public as it stabilizes.",
    },
    blocks: [
      { kind: "h2", text: "The noticing" },
      {
        kind: "p",
        text: "Through 2024 and 2025, the industry argued about whether AI writes code. The more useful question was narrower and older: **when authorship matters — audits, licensing, IP disputes, security review — what is the artifact you point to?**",
      },
      {
        kind: "p",
        text: "The honest answer is: a story. Git history is testimony, not evidence. It can be rebased, amended, and forged, and it routinely is. Everyone was arguing about generation. **Nobody was building the receipt layer.**",
      },
      {
        kind: "quote",
        text: "A claim of authorship should be checkable the way a checksum is checkable — locally, instantly, without trusting the person making the claim.",
        cite: "design note, etch spec draft",
      },
      { kind: "h2", text: "Decisions" },
      {
        kind: "decision",
        title: "Rust core, not a service SDK",
        body: "Verification has to be embeddable — CLI, CI, editors, build systems. A [Rust](https://www.rust-lang.org/) core compiles to every target that matters (native, [WASM](https://webassembly.org/)) from one codebase, and keeps the trusted surface small enough to audit. Authored changes are content-addressed, signed with [ed25519](https://ed25519.cr.yp.to/) against the author's key, and appended to a verifiable chain — verification is a pure function, no authority in the loop.",
      },
      {
        kind: "decision",
        title: "Edge-first verification on Cloudflare Workers",
        body: "Provenance checks are read-heavy, bursty, and global. A protocol that wants to feel like part of the toolchain has to answer in single-digit milliseconds from anywhere — [Cloudflare Workers](https://workers.cloudflare.com/) beat a regional cluster for that shape of traffic.",
      },
      {
        kind: "decision",
        title: "Open-core, by principle",
        body: "A provenance protocol nobody can inspect is a contradiction in terms. The core that makes claims checkable is public; what gets built on top of it is the business.",
      },
      { kind: "h2", text: "State" },
      {
        kind: "stats",
        items: [
          { label: "Model", value: "open-core", note: "verification core public by design" },
          { label: "Core", value: "Rust", note: "native + WASM targets from one codebase" },
          { label: "Status", value: "building", note: "spec stabilizing in public" },
        ],
      },
      {
        kind: "next",
        text: "A public registry, CI integrations, and the boring, load-bearing work of making the spec precise enough that other people can implement it without asking questions.",
      },
    ],
  },
  {
    slug: "stem",
    name: "STEM",
    domain: "System",
    years: "2026",
    title: "Cloning production without the blast radius",
    dek: "STEM stamps out production-shaped database environments — masked, permissioned, and disposable by default.",
    github: "https://github.com/Andrew-Kevin-007/stem-app",
    live: "https://stem-frontend-six.vercel.app/",
    oneLiner:
      "Ephemeral production-grade database environments — cloning, masking, IAM, and cleanup as one pipeline.",
    tldr: {
      problem:
        "**Staging databases lie.** Every team says “don't test against production,” and every team eventually does — because the alternative is stale, hand-fed data that fails to reproduce anything real.",
      approach:
        "**One pipeline, end to end:** a GitHub App triggers Aurora clones, masks sensitive data in-flight, scopes IAM per environment, meters everything, and destroys the environment when its work is done.",
      state:
        "**Carried from idea to public demo** — GitHub App, cloning, masking, IAM, cleanup, telemetry, and dashboard, shipped as one system.",
    },
    blocks: [
      { kind: "h2", text: "The noticing" },
      {
        kind: "p",
        text: "“Don't test against production” is the most-repeated and least-followed rule in infrastructure. The failure isn't discipline. It's that the rule offers no artifact: **teams break it because nothing gives them production-shaped data without production consequences.**",
      },
      {
        kind: "p",
        text: "The fix isn't another warning in the runbook. It's making the safe path the lazy path — an environment that looks exactly like production, appears on demand inside the pull request, and cannot leak what it holds.",
      },
      { kind: "h2", text: "Decisions" },
      {
        kind: "decision",
        title: "Masking inside the pipeline, not after it",
        body: "Post-hoc masking means a window where real data exists in a weaker perimeter. In STEM, an [Aurora clone](https://aws.amazon.com/rds/aurora/) is never reachable before the **masking pass** completes — the unsafe state is unrepresentable in the pipeline's state machine.",
      },
      {
        kind: "decision",
        title: "Disposable by default",
        body: "Environments get a **TTL reaper** at birth, not at cleanup review. Long-lived clones are the failure mode — they drift, they leak, they become the new staging. Anything worth keeping must argue for renewal; nothing is immortal by accident.",
      },
      {
        kind: "decision",
        title: "The PR is the control plane",
        body: "No new portal, no new CLI to learn. STEM runs as a [GitHub App](https://docs.github.com/en/apps) — if the workflow doesn't live where the developer already is, it becomes shelfware. A **scoped IAM** layer and a dashboard make every clone accountable — who asked, what it cost, when it vanished.",
      },
      { kind: "h2", text: "State" },
      {
        kind: "stats",
        items: [
          { label: "Scope", value: "end-to-end", note: "trigger to teardown, one system" },
          { label: "Shipped", value: "public demo", note: "carried from idea to working software" },
          { label: "Surfaces", value: "app + dashboard", note: "GitHub App, telemetry, cost view" },
        ],
      },
      {
        kind: "next",
        text: "Hardening the masking rule engine and publishing the write-up — the system taught more about IAM edge cases than any tutorial ever did.",
      },
    ],
  },
  {
    slug: "auctus",
    name: "Auctus",
    domain: "Research",
    years: "2024–",
    title: "Letting cloud resources clear like a market",
    dek: "Auctus is a bidding protocol for cloud allocation — pricing contention instead of queueing it.",
    oneLiner:
      "A bidding protocol for cloud resource allocation. Contention is a pricing problem wearing an infrastructure costume.",
    tldr: {
      problem:
        "**Allocation under contention is usually answered with queues and static quotas** — mechanisms that hide the real question. When demand exceeds supply, something is being valued; the system just refuses to say what.",
      approach:
        "**Let workloads express value and let the allocator clear.** Auctus treats contention as a market-clearing problem, with the protocol — not an operator — deciding who runs when supply tightens.",
      state:
        "**A paper on this work is under review.** Specifics — venue, results, figures — stay offline until the process concludes. That's how review is supposed to work.",
    },
    blocks: [
      { kind: "h2", text: "The noticing" },
      {
        kind: "p",
        text: "Cloud platforms answer scarcity with the politest possible fictions: priority classes, static quotas, retry queues. Each one is an implicit statement about **which workload matters more** — made once, by an operator, long before the moment of contention.",
      },
      {
        kind: "p",
        text: "But contention is a **pricing problem wearing an infrastructure costume**. When demand exceeds supply, value is being assigned whether or not the system admits it. Auctus starts from the position that the assignment should be explicit, expressed by the workloads themselves, and settled by protocol.",
      },
      { kind: "h2", text: "Approach" },
      {
        kind: "p",
        text: "Workloads carry bids — a declaration of what a unit of resource is worth to them, now. The allocator clears the market instead of draining a queue. The interesting problems live exactly where you'd expect: **fairness under adversarial bidding, starvation resistance, and whether clearing can stay cheap enough to sit in the hot path.**",
      },
      { kind: "h2", text: "Where it stands" },
      {
        kind: "p",
        text: "A paper on this work is currently **under review**. Double-blind review means the details — venue, title, results, figures — stay off this page until the process concludes. Not because the work is fragile, but because **the process deserves the same respect the work does.**",
      },
      {
        kind: "quote",
        text: "If a result only holds when nobody checks it properly, it isn't a result.",
        cite: "lab notebook, on why review matters",
      },
      {
        kind: "next",
        text: "The review cycle runs its course. The open questions — fair clearing under adversarial load, allocation as a first-class protocol concern — are longer than any single paper.",
      },
    ],
  },
];

export const getStudy = (slug: string) => studies.find((s) => s.slug === slug);

/** Selected archive — real projects, links added only after each is verified live. */
export type ArchiveItem = {
  name: string;
  year: string;
  domain: string;
  oneLiner: string;
  /** Omitted until each repo is verified live — see honesty rules above. */
  github?: string;
};

export const archive: ArchiveItem[] = [
  {
    name: "VEGA",
    year: "2026",
    domain: "AI Security",
    oneLiner: "Autonomous penetration testing at machine speed — a security engineer that doesn't sleep.",
    github: "https://github.com/Andrew-Kevin-007/VEGA",
  },
  {
    name: "Neurix OS",
    year: "2026",
    domain: "Platform",
    oneLiner: "Orchestration for intelligent workflows — monitoring, coordination, and evaluation with control.",
    github: "https://github.com/Andrew-Kevin-007/Neurix",
  },
  {
    name: "Factory OS",
    year: "2025",
    domain: "IaC",
    oneLiner: "Declarative cloud resource management — provisioning as configuration, not ceremony.",
    github: "https://github.com/Andrew-Kevin-007/factory-os-core",
  },
  {
    name: "CLUTCH",
    year: "2025",
    domain: "Fintech",
    oneLiner: "BNPL exposure tracking with vision-based OCR — built under hackathon pressure, kept for the lessons.",
  },
];
