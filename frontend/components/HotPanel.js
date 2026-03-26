"use client";

import { useState } from "react";

import { formatDate } from "@/lib/format";

const SOURCE_ICONS = {
  GitHub: "⚙️",
  X: "⚡",
  Reddit: "🧠",
  LinkedIn: "💼",
};

export default function HotPanel({ items }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleItems = isExpanded ? items : items.slice(0, 5);
  const hiddenCount = Math.max(items.length - 5, 0);

  return (
    <section className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(34,30,27,0.98),rgba(24,21,19,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">What&apos;s hot in AI</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            A quick pulse on the links, launches, and debates shaping the week.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-transparent p-5 text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400">
            No updates yet
          </div>
        ) : null}

        {visibleItems.map((item) => (
          <a
            key={item._id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="block py-1 transition hover:opacity-90"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-lg">{SOURCE_ICONS[item.source] || "🔥"}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium leading-6 text-stone-900 dark:text-stone-100">{item.title}</h3>
                <div className="mt-3 text-xs text-stone-500 dark:text-stone-400">
                  {item.tag} • {item.source} • {formatDate(item.createdAt)}
                </div>
              </div>
            </div>
          </a>
        ))}

        {hiddenCount > 0 ? (
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className="pt-2 text-sm text-stone-500 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
          >
            {isExpanded ? "Show less ↑" : `Show ${hiddenCount} more →`}
          </button>
        ) : null}
      </div>
    </section>
  );
}
