"use client";

export default function GlobalError({ error, reset }) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-stone-300 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
      <h2 className="text-3xl font-semibold text-stone-900 dark:text-stone-100">Something went wrong</h2>
      <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">
        {error?.message || "We couldn't load this page right now."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-white dark:text-black dark:hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
