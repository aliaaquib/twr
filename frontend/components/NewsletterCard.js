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
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.24)] backdrop-blur">
      <h2 className="text-xl font-semibold tracking-tight text-white">Subscribe</h2>
      <p className="mt-2 text-sm leading-6 text-white/55">
        A simple weekly note on product shifts, models, and the ideas worth paying attention to.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#7c8cff]"
        />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-white/90"
        >
          Subscribe
        </button>
      </form>

      {status ? <p className="mt-4 text-sm leading-6 text-white/45">{status}</p> : null}
    </section>
  );
}

