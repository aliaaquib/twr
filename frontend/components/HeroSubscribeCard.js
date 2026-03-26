"use client";

import { useState } from "react";

export default function HeroSubscribeCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setStatus("Add your email to subscribe.");
      return;
    }

    setStatus("Thanks. Subscription UI is ready; backend email flow comes next.");
    setEmail("");
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(34,30,27,0.98),rgba(24,21,19,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80">
      <h2 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
        Get weekly report in your inbox.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        Every Saturday &amp; Sunday.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 dark:border-stone-700 dark:bg-stone-950/80 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-white dark:text-black dark:hover:opacity-90"
        >
          Subscribe
        </button>
      </form>

      <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
        🎓 25 people already learning
      </p>

      {status ? <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">{status}</p> : null}
    </section>
  );
}
