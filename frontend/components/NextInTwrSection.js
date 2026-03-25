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
    <section className="mt-24 border-t border-white/5 pt-8">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-white">✍️ What&apos;s next in TWR</h2>
          <p className="text-base text-white/55">Topics we&apos;re exploring next.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              className="rounded-full border border-gray-700 bg-transparent px-4 py-2 text-sm text-white/75 transition hover:cursor-pointer hover:bg-white/10"
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <p className="text-sm font-normal text-white/48">
            Want us to explain something? Suggest a topic.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl items-center gap-3">
            <input
              type="text"
              value={suggestion}
              onChange={(event) => setSuggestion(event.target.value)}
              placeholder="e.g. How do AI chips work?"
              className="w-full rounded-md border border-gray-700 bg-[#111] px-4 py-2 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md border border-gray-700 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
