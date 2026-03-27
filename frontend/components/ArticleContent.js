const parseMarkdown = (content) => {
  const blocks = [];
  const lines = String(content || "").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trimEnd();

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({ type: "code", content: codeLines.join("\n") });
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", content: line.replace(/^##\s*/, "") });
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items = [];

      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().replace(/^- /, ""));
        index += 1;
      }

      blocks.push({ type: "list", content: items });
      continue;
    }

    const paragraphLines = [];

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("## ") &&
      !lines[index].startsWith("```") &&
      !lines[index].trim().startsWith("- ")
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push({ type: "paragraph", content: paragraphLines.join(" ") });
  }

  return blocks;
};

export default function ArticleContent({ content, fallbackPost }) {
  if (!content?.trim()) {
    return (
      <div className="mt-12 space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            This week in AI
          </h2>
          <p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
            {fallbackPost.thisWeek}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            One idea that matters
          </h2>
          <p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
            {fallbackPost.idea}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Signals
          </h2>
          <ul className="space-y-3 pl-5 text-lg leading-relaxed text-stone-700 marker:text-stone-500 dark:text-stone-300 dark:marker:text-stone-400">
            {fallbackPost.signals.map((signal, index) => (
              <li key={`${fallbackPost._id}-signal-${index}`}>{signal}</li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  const blocks = parseMarkdown(content);

  return (
    <div className="mt-12 space-y-8">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2
              key={`heading-${index}`}
              className="pt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100"
            >
              {block.content}
            </h2>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={`paragraph-${index}`}
              className="text-lg leading-relaxed text-stone-700 dark:text-stone-300"
            >
              {block.content}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={`list-${index}`}
              className="space-y-3 pl-5 text-lg leading-relaxed text-stone-700 marker:text-stone-500 dark:text-stone-300 dark:marker:text-stone-400"
            >
              {block.content.map((item, itemIndex) => (
                <li key={`list-${index}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={`code-${index}`}
              className="overflow-x-auto rounded-2xl border border-stone-200 bg-stone-50 p-5 text-sm leading-relaxed text-stone-700 dark:border-stone-800 dark:bg-stone-950/70 dark:text-stone-300"
            >
              <code>{block.content}</code>
            </pre>
          );
        }

        return null;
      })}
    </div>
  );
}
