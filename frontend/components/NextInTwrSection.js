"use client";

import { useState } from "react";

const TOPICS = [
  "How does AI summarization work?",
  "How does AI handle different languages?",
  "What is knowledge distillation?",
  "How does AI detect deepfakes?",
  "What is neuromorphic computing?",
  "Why are smaller AI models winning?",
];

export default function NextInTwrSection() {
  const [suggestion, setSuggestion] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!suggestion.trim()) {
      return;
    }

    console.log("TWR topic suggestion:", suggestion.trim());
    setSuggestion("");
  };

  return (
    <section className="mt-24 border-t border-stone-200 pt-8 dark:border-stone-800">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">✍️ What&apos;s next in TWR</h2>
          <p className="text-base text-stone-600 dark:text-stone-400">Topics we&apos;re exploring next.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              className="rounded-full border border-stone-300 bg-transparent px-4 py-2 text-sm text-stone-700 transition hover:cursor-pointer hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800/40"
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <p className="text-sm font-normal text-stone-500 dark:text-stone-400">
            Want us to explain something? Suggest a topic.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl items-center gap-3">
            <input
              type="text"
              value={suggestion}
              onChange={(event) => setSuggestion(event.target.value)}
              placeholder="e.g. How do AI chips work?"
              className="w-full rounded-md border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-100 hover:text-stone-950 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800/40 dark:hover:text-white"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
