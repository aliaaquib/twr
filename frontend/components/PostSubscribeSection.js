"use client";

import { useState } from "react";

export default function PostSubscribeSection() {
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
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          Get weekly update in your inbox
        </h2>
        <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          Every saturday and sunday. No spam, 30 people are already learning 📚
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          rows={1}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 dark:border-stone-700 dark:bg-stone-950/80 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-white dark:text-black dark:hover:opacity-90"
        >
          Subscribe
        </button>
      </form>

      {status ? (
        <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">{status}</p>
      ) : null}
    </section>
  );
}
