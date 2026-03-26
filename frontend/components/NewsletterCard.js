"use client";

import { useState } from "react";

export default function NewsletterCard() {
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
    <section className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(34,30,27,0.98),rgba(24,21,19,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80">
      <h2 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">Subscribe</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        A simple weekly note on product shifts, models, and the ideas worth paying attention to.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 dark:border-stone-700 dark:bg-stone-950/80 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
        >
          Subscribe
        </button>
      </form>

      {status ? <p className="mt-4 text-sm leading-relaxed text-stone-500 dark:text-stone-400">{status}</p> : null}
    </section>
  );
}
