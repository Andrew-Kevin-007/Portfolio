/**
 * Renders **bold** through the color channel (strong = text-1) and
 * [label](https://url) as external links with the house underline —
 * straight, hairline, offset. Deliberately tiny — not a markdown parser.
 * Nesting (bold inside links or vice versa) is unsupported on purpose.
 */
import type { ReactNode } from "react";

export function Rich({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else {
      nodes.push(
        <a
          key={key++}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-hairline-strong underline-offset-4 transition-colors duration-300 hover:text-text-1 hover:decoration-text-3"
        >
          {match[2]}
        </a>
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));

  return <>{nodes}</>;
}
