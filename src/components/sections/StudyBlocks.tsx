import type { StudyBlock } from "@/content/work";
import { Rich } from "@/lib/rich";
import { Reveal } from "@/components/motion/Reveal";

export function StudyBlocks({
  blocks,
  nextLabel,
}: {
  blocks: StudyBlock[];
  nextLabel: string;
}) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <Reveal key={i}>
                <h2 className="pt-12 text-heading">
                  {block.text}
                  <span className="text-text-3">.</span>
                </h2>
              </Reveal>
            );
          case "h3":
            return (
              <Reveal key={i}>
                <h3 className="pt-4 text-title">{block.text}</h3>
              </Reveal>
            );
          case "p":
            return (
              <Reveal key={i}>
                <p className="max-w-[62ch] text-bodylg text-text-2">
                  <Rich text={block.text} />
                </p>
              </Reveal>
            );
          case "quote":
            return (
              <Reveal key={i}>
                <blockquote className="border-l border-hairline-strong py-1 pl-6">
                  <p className="max-w-[52ch] text-monosm text-text-2">
                    {block.text}
                  </p>
                  {block.cite && (
                    <cite className="mt-2 block text-monosm not-italic text-text-3">
                      — {block.cite}
                    </cite>
                  )}
                </blockquote>
              </Reveal>
            );
          case "decision":
            return (
              <Reveal key={i}>
                <div className="rounded-2xl border border-hairline p-6 sm:p-7">
                  <h3 className="text-body text-text-1">{block.title}</h3>
                  <p className="mt-2 max-w-[60ch] text-body text-text-2">
                    <Rich text={block.body} />
                  </p>
                </div>
              </Reveal>
            );
          case "stats":
            return (
              <Reveal key={i}>
                <div className="grid gap-6 py-4 sm:grid-cols-3">
                  {block.items.map((s) => (
                    <div key={s.label} className="border-t border-hairline-strong pt-4">
                      <p className="text-monosm uppercase text-text-3">{s.label}</p>
                      <p className="mt-1.5 text-heading">{s.value}</p>
                      <p className="mt-1.5 text-meta text-text-2">{s.note}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            );
          case "next":
            return (
              <Reveal key={i}>
                <div className="border-t border-hairline pt-8">
                  <p className="text-monosm uppercase text-text-3">{nextLabel}</p>
                  <p className="mt-3 max-w-[62ch] text-bodylg text-text-2">
                    <Rich text={block.text} />
                  </p>
                </div>
              </Reveal>
            );
        }
      })}
    </div>
  );
}
