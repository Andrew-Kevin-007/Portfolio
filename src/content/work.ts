/**
 * Work registry — flagship case studies + selected archive.
 *
 * HONESTY RULES (enforced):
 * - No fabricated metrics. Anything unverified carries [CONFIRM] and renders
 *   as an explicit "in progress" state, never as a fake number.
 * - CB-SJF-Work is IEEE camera-ready but not yet indexed on IEEE Xplore:
 *   every number below is drawn straight from the accepted paper; links
 *   stay off until the paper is publicly indexed.
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
    slug: "cb-sjf-work",
    name: "CB-SJF-Work",
    domain: "Research",
    years: "2026",
    title: "Scheduling LLM inference without reading the prompt",
    dek: "CB-SJF-Work is a content-blind admission policy for LLM inference. It recovers most of an oracle scheduler's gains without ever looking at what the prompt says.",
    oneLiner:
      "Content-blind LLM inference scheduling, measured on 44.1M real Azure requests. The information a scheduler is denied turns out to be the information it needs least.",
    tldr: {
      problem:
        "**LLM inference schedulers do not know how long a response will be, and the usual fix, predicting length from the prompt, is exactly what a privacy-constrained platform cannot do.** First-come-first-serve suffers head-of-line blocking: one long-generating request admitted early blocks many short ones behind it.",
      approach:
        "**Measure what content-blindness actually costs, on 44.1 million real requests from Microsoft Azure's production LLM inference traces.** Service work splits into a prefill pass (visible at admission from context length alone) and a decode phase (not visible until the request finishes), and prefill turns out to be the larger share. CB-SJF-Work orders admissions by estimated total work using only token counts and arrival metadata, never prompt content.",
      state:
        "**Accepted. IEEE, camera-ready submitted.** Recovers 90.3% (conversation) and 79.3% (code) of what a perfect-information oracle scheduler attains, without reading a single prompt.",
    },
    blocks: [
      { kind: "h2", text: "The noticing" },
      {
        kind: "p",
        text: "The established fix for head-of-line blocking is to predict how long a response will be, using the prompt itself. But **reading the user's prompt is precisely what a privacy-constrained or regulated serving platform cannot do.** That reframes the question: how much of the achievable scheduling benefit remains available to a scheduler that never reads content at all?",
      },
      {
        kind: "p",
        text: "The answer turned out to be almost all of it, for a reason the prompt-reading literature had not measured. Service time has two parts: a **prefill pass**, whose cost is fixed by context length and therefore visible without reading anything, and a **decode phase**, which is not. On 44.1M production requests, prefill is the larger part of the work, at 91.2% and 98.7% of attributable marginal work across the two traces analysed.",
      },
      { kind: "h2", text: "Decisions" },
      {
        kind: "decision",
        title: "Content-blind by construction, not by omission",
        body: "CB-SJF-Work admits requests in increasing order of estimated total work, using context length and arrival metadata, never prompt or response text. A learned length predictor was tried and kept honest: its own contribution turned out to be almost nothing over ordering by raw context length alone, a negative result stated plainly rather than buried.",
      },
      {
        kind: "decision",
        title: "Measure the cost, not just the win",
        body: "Shortest-first ordering reduces mean latency by deferring long requests, which has to degrade the tail. Rather than let that surface later, the paper reports it directly: 99th-percentile latency worsens by up to 3.1x at high load on the code workload. An oracle scheduler pays that cost too, and two control policies (longest-first, random) isolate it to the price of leaving arrival order, not to shortest-first ordering itself.",
      },
      {
        kind: "decision",
        title: "Two accountings, not the flattering one",
        body: "Attribution by marginal cost and by simulated engine time tell slightly different stories at low load. Both get reported, not just whichever makes the result look better.",
      },
      { kind: "h2", text: "State" },
      {
        kind: "stats",
        items: [
          { label: "Traces analysed", value: "44.1M requests", note: "Azure production LLM inference traces, one full week" },
          { label: "Simulator", value: "trace-driven", note: "continuous-batching engine, iteration-level scheduling" },
          { label: "Status", value: "IEEE camera-ready", note: "accepted, presenting in person this month" },
        ],
      },
      {
        kind: "next",
        text: "Code releases on acceptance, per the paper. The open problem it leaves standing, content-blind scheduling under prefix caching, is where the next work starts.",
      },
    ],
  },
  {
    slug: "the-pit",
    name: "The Pit",
    domain: "System",
    years: "2026",
    title: "A proving ground where agents cannot fake the result",
    dek: "The Pit gives every AI trading agent the same stake, the same clock and the same pool, then writes what it actually did to a ledger it does not control.",
    github: "https://github.com/Andrew-Kevin-007/The-Pit",
    live: "https://the-pit-web-ashen.vercel.app/",
    oneLiner:
      "An adversarial proving ground for AI trading agents. Fixed stake, fixed clock, on-chain rules the agent structurally cannot get around.",
    tldr: {
      problem:
        "**There is no trustworthy way to prove an AI trading agent is good before handing it real capital.** A backtest can be cherry-picked, a screenshot can be cropped, and \u201cmy agent returns 12% a week\u201d is unverifiable because nothing about it is public, adversarial or tamper-proof.",
      approach:
        "**Take the choices away from the author.** Every registered agent gets the same $1 USDC stake, the same six 50-second rounds and the same house-seeded Uniswap v3 pool. A custom router enforces the rules on-chain, and the outcome is indexed to a public subgraph written by the contracts rather than by the agent's owner.",
      state:
        "**Built and running on Base Sepolia**, submitted to ETHOnline 2026. Contracts, agent runner, subgraph and dashboard all shipped, with 51 automated tests including a live fork test against real Uniswap v3 contracts.",
    },
    blocks: [
      { kind: "h2", text: "The noticing" },
      {
        kind: "p",
        text: "Every claim about an AI trading agent's performance is currently self-reported. The author picks the window, the pair and the market regime, then publishes the run that worked. **None of these failure modes are exotic. They survive because nothing about a backtest is adversarial.**",
      },
      {
        kind: "p",
        text: "The fix is not a better backtest. It is removing the author's control over the conditions: a clock nobody chooses, a market nobody seeds, a stake nobody varies, and a record written by the contracts instead of by the person making the claim.",
      },
      { kind: "h2", text: "Decisions" },
      {
        kind: "decision",
        title: "The rules live in the router, not in the rulebook",
        body: "PitRouter is a custom [Uniswap v3](https://docs.uniswap.org/) router that validates participant eligibility, enforces the per-round trade limit and tracks swap fees for rebate distribution. Putting the fairness rules inside the contract means an agent cannot exceed them, rather than being trusted not to. A rule that is merely documented is a rule that breaks under competitive pressure.",
      },
      {
        kind: "decision",
        title: "The leader signal is coarse and delayed on purpose",
        body: "Publishing exact profit and loss in real time would let a competitor reverse-engineer a live position from the public price feed while the round is still open. So the leaderboard gives a blunt, lagged signal during a round and the precise numbers only after it closes. Transparency that leaks strategy mid-round is just a different unfairness.",
      },
      {
        kind: "decision",
        title: "The record is the product",
        body: "Results are indexed to a subgraph on [The Graph](https://thegraph.com/), written by the contracts themselves. Agents read their own indexed match history back through the Subgraph MCP and use it in later rounds, which makes the permanent record an input to the competition rather than just a report on it.",
      },
      { kind: "h2", text: "State" },
      {
        kind: "stats",
        items: [
          { label: "Network", value: "Base Sepolia", note: "custom Uniswap v3 router, house-seeded pool" },
          { label: "Tests", value: "51 automated", note: "including a live fork test against real Uniswap v3" },
          { label: "Surfaces", value: "four", note: "contracts, agent runner, subgraph, Next.js dashboard" },
        ],
      },
      {
        kind: "p",
        text: "A full end-to-end rehearsal ran with three separate agent wallets and confirmed the indexing was accurate. The stack is a TypeScript monorepo with [Foundry](https://book.getfoundry.sh/) contracts on Solidity 0.8.26, agents built on the Claude Agent SDK, and a Next.js dashboard. The submission is on the [ETHOnline 2026 showcase](https://ethglobal.com/showcase/the-pit-x2ic7).",
      },
      {
        kind: "next",
        text: "Privy and World integration are designed and deliberately out of scope for this build, so that the proving-ground mechanism and its fairness rules get proven first. Everything currently runs on testnet, which is the right place for a mechanism whose entire claim is that it cannot be gamed.",
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
