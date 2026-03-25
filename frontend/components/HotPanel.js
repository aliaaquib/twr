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
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.24)] backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">What&apos;s hot in AI</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            A quick pulse on the links, launches, and debates shaping the week.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-white/10 bg-black/20 p-5 text-sm text-white/45">
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
                <h3 className="text-sm font-medium leading-6 text-white">{item.title}</h3>
                <div className="mt-3 text-xs text-white/40">
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
            className="pt-2 text-sm text-white/58 transition hover:text-white"
          >
            {isExpanded ? "Show less ↑" : `Show ${hiddenCount} more →`}
          </button>
        ) : null}
      </div>
    </section>
  );
}
