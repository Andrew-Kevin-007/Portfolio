# What edith is

Written for: a Claude Code terminal agent working on Kevin's portfolio (kevinandrew.tech), so it can describe or link edith
accurately. Everything below is drawn straight from edith's own site code (`D:\page_content\web`), not invented. Where a fact
is not here, it is not confirmed: do not add member counts, dates or claims the site itself does not make.

## In one line

edith is a community that runs itself, for developers and technologists across Web2, Web3, AI and whatever comes next to
connect, collaborate, build and launch. It lives on Discord; the website is where people learn about it, look at what has
shipped, and join.

Tagline on the site: "A legion of builders that runs itself." Kevin (Andrew Kevin) founded it and holds the role "Origin".

## What actually happens there

The community is organised as six hubs inside one Discord server, each a channel with a plain job:

| Hub | Channel | What it is for |
| --- | --- | --- |
| Ideas | `#brainstorm` | Say an idea out loud before writing a line, and get honest feedback |
| Build | `#web2`, `#web3`, `#ai` | Build in whatever stack the idea actually needs |
| Team up | `#find-a-team` | Say what you need (a designer, a backend hand) or find a hackathon team |
| Help | `#rubber-duck` | Talk a problem through out loud; someone has usually hit the same wall |
| Feedback | `#rfcs` | Request a feature or write a proposal; Maintainers vote in the open |
| Show off | `#ship-it` | Post a finished thing with a demo; shipped projects are shown live at Demo Day |

There is also `#wip` (build logs while work is in progress) and `#apply-here` (where a Catalyst opens a pull request to become
a Maintainer) and `#touch-grass` (a general hangout).

## Membership: Catalyst, then Maintainer

- **Catalyst**: what everyone is the moment they join, with full access to every public channel.
- **Maintainer**: earned, not bought or appointed in bulk. It takes being around for 30 or more days, helping people,
  shipping something, and a public profile. A Catalyst opens a pull request in `apply-here` and needs two endorsements.
  edith's bot and agent run the promotion process against the same criteria for everyone, and the founder is the only
  person who can promote (Kevin, 30 September 2026). Maintainers vote on RFCs, lead teams, and can take client work or
  launch a venture under the edith name (the founder approves each venture).
- **Core**: not a separate group. The site's copy says "Core" but means the Maintainers (Kevin, 30 September 2026); there is
  no Core tier and no separate team of mediators. In any new writing say "Maintainers", and do not describe Core as its
  own body.

At the time of writing the Maintainer roster is deliberately short: Kevin is currently the one Maintainer (Origin). Do not
state a member count anywhere; the site itself never gives one.

## How decisions get made

"The community decides": anyone can suggest a feature. Formal proposals go to `#rfcs`, where Maintainers vote in the open.
Once a vote is done, the Maintainers carry out the result. The site is explicit: "This is a governance culture, not a
blockchain. There is no token and nothing on-chain." Never describe edith with token, DAO or on-chain governance language;
the site deliberately avoids it.

## Values (the site's own words)

- **Autonomous.** Nobody hands out work. Members pitch ideas, form their own teams and ship on their own terms.
- **Decentralised.** The community decides. Anyone can suggest, Maintainers vote and Core carries out the result. (The site says "Core" here; it means Maintainers.)
- **Builder-first.** Shipping beats talking, a demo beats a deck, and edith builds in public.
- **Stack-agnostic.** Pick the right tool for the problem, not the hype.
- **Open by default.** Ideas get better in public, and credit goes to the people who helped.
- **Reputation is earned.** Membership comes from what you build and who you help, not follower counts.

## Trust and safety

Everyone passes rules screening on the way in, and AutoMod blocks spam, scams, invite links and mention raids. The site
states plainly: nobody from edith will ever DM asking for keys or payments.

## Joining

Clicking "Become a Catalyst" leads to the site's own `/join` page, which explains the process (not straight to the Discord
invite). It has you sign in with Discord, then with GitHub (to confirm both accounts are genuinely yours), then fill in a
short form. The full automatic version of this (a 24 hour deadline to complete the form, automatic removal if it is missed,
minimum account ages) is built and deployed but was not yet switched on for the public at the time of writing; do not
promise a specific deadline or automatic removal as if it is definitely live without checking.

## The website itself

Built with Next.js (App Router), React, three.js and GSAP, deployed on Vercel. Pages: the home page (mission, the hubs,
membership, values, safety), **The Legion** (`/legion`, a directory of Maintainers and Catalysts who chose to be listed,
plus how to earn a Maintainer seat), **Docs** (`/docs`, FAQ, rules, privacy policy, terms), **Studio** (`/studio`, recently
renamed from Showcase: real, working things edith has built, with real code excerpts and measured facts, used when a
Maintainer pitches client work), and `/join`.

**Look and feel.** Pitch black background throughout. Cream text (`#ECE7E0`). One accent gold (`#FFBC09`). A marble motif in
a warm ramp of gold, orange, red and magenta (`#FEAF01` to `#E803D1`) used for hover glows and one hero WebGL object (an
animated marble whose veins reveal themselves and follow the pointer), never as large flat colour. Mono type for labels and
code-flavoured details (channel names, technical chips), a lighter display face for headlines. No token or coin imagery
beyond that colour ramp; nothing blockchain-styled.

## Links (real, current)

- Site: `https://edith-plum.vercel.app` (no custom domain yet)
- Discord invite: `https://discord.gg/TmVeNgzw4K`
- Contact: `hello.edithstudio@gmail.com`
- Book a call: `https://calendly.com/hello-edithstudio/30min`

## Rules for writing about edith

- No invented facts: no member counts, no dates, no named projects beyond what Studio actually lists.
- No token, DAO, coin or on-chain governance language.
- Do not name a specific city for edith; the site does not.
- British spelling, no en or em dashes (edith's own copy rule, and a reasonable one to match).
- Never present Core as a separate group; it means the Maintainers. Promotion is run by edith's bot and agent, and only the
  founder can promote.
- Write the name lowercase, "edith", everywhere, including at the start of a sentence (the site's own rule in practice).
- The portfolio only points to edith (a reference backlink from the founder). Onboarding and the details live on edith's own
  site, so keep portfolio copy short and link out rather than re-explaining.
- If asked something this file does not answer, say so rather than guessing, or ask Kevin.
