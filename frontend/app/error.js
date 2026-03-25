"use client";

export default function GlobalError({ error, reset }) {
  return (
    <div className="mx-auto max-w-2xl rounded-[32px] border border-red-200 bg-white p-10 text-center shadow-card">
      <h2 className="text-3xl font-semibold text-ink">Something went wrong</h2>
      <p className="mt-4 text-base leading-7 text-muted">
        {error?.message || "We couldn't load this page right now."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
      >
        Try again
      </button>
    </div>
  );
}

