/**
 * Essays — ported verbatim from the previous site.
 * Block types: p (paragraph) · inner (quiet aside / self-dialogue) · standout (emphasized statement)
 * Inline **bold** renders through the color channel (see writing page renderer).
 */

export type WritingBlock = {
  type: "p" | "inner" | "standout";
  text: string;
};

export type Essay = {
  slug: string;
  title: string;
  published: string;
  description: string;
  minutes: number;
  content: WritingBlock[];
};

export const essays: Essay[] = [
  {
    slug: "on-becoming-before-knowing-why",
    title: "On Becoming Before Knowing Why",
    published: "April 2026",
    description:
      "I didn't start with a clear purpose. No grand vision. No perfectly mapped future. Just a feeling I couldn't ignore.",
    minutes: 3,
    content: [
      { type: "p", text: "I didn't start with a clear purpose." },
      { type: "p", text: "No grand vision. No perfectly mapped future." },
      { type: "p", text: "Just a feeling I couldn't ignore—" },
      { type: "inner", text: "I can't stay like this." },
      { type: "p", text: "At first, I thought I needed clarity before action. That I had to figure everything out before I could begin." },
      { type: "inner", text: "(pause)" },
      { type: "p", text: "That was just an excuse." },
      { type: "p", text: "Because the truth is…" },
      { type: "standout", text: "Clarity doesn't come first. Action does." },
      { type: "p", text: "I started small. Not because it was easy— but because it was the only thing I could control." },
      { type: "p", text: "One habit. One decision. One promise to myself I refused to break." },
      { type: "p", text: "That's when Atomic Habits stopped being just a book." },
      { type: "p", text: "It became a lens." },
      { type: "p", text: "It made me realize—" },
      { type: "standout", text: "I wasn't chasing results. I was building identity." },
      { type: "p", text: "Every small action was a vote. Not for what I achieve— but for who I become." },
      { type: "inner", text: "(talking to myself again)" },
      { type: "inner", text: "“Do you even know where this is going?”" },
      { type: "inner", text: "“…no.”" },
      { type: "inner", text: "“Then why keep going?”" },
      { type: "inner", text: "“…because stopping feels worse.”" },
      { type: "p", text: "There was no dramatic shift. No single moment where everything made sense." },
      { type: "p", text: "Just repetition. Consistency. Days that looked boring from the outside— but were quietly changing everything inside." },
      { type: "p", text: "And somewhere in that process, a different question started forming." },
      { type: "p", text: "Not “what should I do?” but" },
      { type: "inner", text: "“what kind of life am I building?”" },
      { type: "p", text: "That's where Ikigai entered." },
      { type: "p", text: "Not as an answer— but as a confrontation." },
      { type: "p", text: "It didn't give me purpose." },
      { type: "standout", text: "It made me realize that purpose isn't found first. It's uncovered… through movement." },
      { type: "inner", text: "(another moment with myself)" },
      { type: "inner", text: "“What if you're going in the wrong direction?”" },
      { type: "inner", text: "“…then I'll adjust.”" },
      { type: "inner", text: "“What if it takes too long?”" },
      { type: "inner", text: "“…then I'll keep going anyway.”" },
      { type: "p", text: "That's when it clicked." },
      { type: "standout", text: "You don't wait to understand your path. You walk it— and understanding follows." },
      { type: "p", text: "The real shift wasn't external." },
      { type: "inner", text: "It was internal." },
      { type: "p", text: "I stopped asking for certainty. And started choosing commitment." },
      { type: "p", text: "This isn't a story about finding purpose." },
      { type: "standout", text: "It's about building yourself until your purpose has no choice but to reveal itself." },
      { type: "p", text: "I'm still in the middle of it. Still figuring things out. Still becoming." },
      { type: "p", text: "But I know this now—" },
      { type: "p", text: "You don't need all the answers to begin." },
      { type: "standout", text: "You just need enough honesty to admit that staying the same is no longer an option." },
    ],
  },
  {
    slug: "the-version-no-one-sees",
    title: "The Version No One Sees",
    published: "March 2026",
    description:
      "Every person we admire has a version of themselves that no one saw. The quiet, uncertain version that built everything.",
    minutes: 3,
    content: [
      { type: "p", text: "We don't meet them at the beginning." },
      { type: "p", text: "We meet them when they've already become something." },
      { type: "inner", text: "**Cristiano Ronaldo** scoring." },
      { type: "inner", text: "**Spider-Man** saving the city." },
      { type: "inner", text: "**Luffy** standing like he was always meant to be there." },
      { type: "p", text: "That's the version we remember." },
      { type: "p", text: "But there's another version." },
      { type: "p", text: "The one no one talks about." },
      { type: "p", text: "The one that wakes up early without an **audience**." },
      { type: "p", text: "The one that keeps going without **applause**." },
      { type: "p", text: "**Ronaldo** wasn't always a name." },
      { type: "p", text: "There was a time when it was just him— training, repeating, failing, trying again." },
      { type: "p", text: "No cameras. No expectations. Just **work**." },
      { type: "p", text: "That part doesn't get posted." },
      { type: "p", text: "**Peter Parker** isn't just Spider-Man." },
      { type: "p", text: "He's the version of himself trying to balance everything and barely holding it together." },
      { type: "p", text: "The missed calls. The quiet sacrifices. The weight of **responsibility** that no one else can see." },
      { type: "p", text: "It's easy to admire the hero." },
      { type: "p", text: "It's harder to understand what it took to become him." },
      { type: "p", text: "And then there's **Luffy**." },
      { type: "p", text: "No title. No guarantees. Just **belief**." },
      { type: "p", text: "He doesn't wait for the world to recognize him. He moves like it already has." },
      { type: "inner", text: "“What if I'm not ready?”" },
      { type: "inner", text: "“…they weren't either.”" },
      { type: "inner", text: "“What if no one notices?”" },
      { type: "inner", text: "“…that was never the point.”" },
      { type: "p", text: "That's when it starts to make sense." },
      { type: "p", text: "Every person we admire has a **version** of themselves that no one saw." },
      { type: "p", text: "The quiet version. The uncertain version." },
      { type: "p", text: "The one that kept going even when it didn't feel like it mattered." },
      { type: "p", text: "We don't celebrate that version." },
      { type: "standout", text: "But that's the one that **builds everything**." },
      { type: "inner", text: "(soft realization)" },
      { type: "p", text: "Maybe I'm in that version right now." },
      { type: "p", text: "No recognition. No guarantees. Just effort." },
      { type: "p", text: "And maybe that's enough." },
      { type: "p", text: "Because one day—" },
      { type: "inner", text: "this version… the one no one sees— will be the reason everything else exists." },
    ],
  },
  {
    slug: "the-gap-between-who-you-are-and-who-you-could-be",
    title: "The Gap Between Who You Are and Who You Could Be",
    published: "February 2026",
    description:
      "There's a strange feeling when you've seen what you could be. The gap isn't failure—it's direction.",
    minutes: 3,
    content: [
      { type: "p", text: "There's a strange feeling that's hard to explain." },
      { type: "p", text: "You're not where you used to be." },
      { type: "p", text: "But you're not where you want to be either." },
      { type: "standout", text: "You've changed. You can see it." },
      { type: "inner", text: "In the way you think. In the way you move. In the things you no longer tolerate." },
      { type: "p", text: "But still— something feels… **incomplete**." },
      { type: "inner", text: "(pause)" },
      { type: "p", text: "Not in a loud way." },
      { type: "p", text: "Just a quiet awareness that there's more in you than what you're currently living." },
      { type: "inner", text: "“You've already come this far.”" },
      { type: "inner", text: "“…I know.”" },
      { type: "inner", text: "“Then why does it still feel like it's not enough?”" },
      { type: "inner", text: "“…because I've seen what I could be.”" },
      { type: "standout", text: "That's the gap." },
      { type: "p", text: "Not failure. Not confusion. Just **distance**." },
      { type: "p", text: "The distance between who you are right now— and who you know you're capable of becoming." },
      { type: "p", text: "And the hardest part? You can't **unsee** it." },
      { type: "p", text: "Once you've felt that version of yourself— even for a moment— you can't go back to being comfortable where you are." },
      { type: "p", text: "Everything starts to feel different." },
      { type: "inner", text: "The distractions don't hit the same. The comfort doesn't feel as comfortable. The excuses don't sound as convincing." },
      { type: "p", text: "Because somewhere inside you— there's a version of you that already **knows better**." },
      { type: "inner", text: "“What if I never reach that version?”" },
      { type: "inner", text: "“…then I'll get as close as I can.”" },
      { type: "inner", text: "“What if it takes years?”" },
      { type: "inner", text: "“…then that's what it takes.”" },
      { type: "standout", text: "That's when it shifts. The gap stops feeling like pressure. And starts feeling like **direction**." },
      { type: "p", text: "Not something that holds you back— but something that pulls you **forward**." },
      { type: "p", text: "You don't need to close it all at once." },
      { type: "p", text: "You just need to move toward it. One step. One decision. One day at a time." },
      { type: "p", text: "Because the truth is— that version of you? It's not imaginary." },
      { type: "standout", text: "It's **built**." },
      { type: "p", text: "And every time you choose **growth over comfort**— you get a little closer." },
      { type: "inner", text: "(soft ending)" },
      { type: "p", text: "Maybe the gap isn't something to fear." },
      { type: "standout", text: "Maybe it's **proof** that you're not done yet." },
    ],
  },
];

export const getEssay = (slug: string) =>
  essays.find((e) => e.slug === slug);
