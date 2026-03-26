import Footer from "@/components/Footer";

export const metadata = {
  title: "Feedback | The Weekly Roundup",
  description: "Share a correction, suggestion, or note with The Weekly Roundup.",
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <section className="border-b border-stone-200 pb-10 pt-4 dark:border-stone-800">
        <div className="inline-flex rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
          Feedback
        </div>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] text-stone-900 dark:text-stone-100 sm:text-6xl">
          Let us know
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          Found an error, spotted something unclear, or have an idea for a better issue? We’d love
          to hear it.
        </p>
      </section>

      <section className="py-12">
        <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(34,30,27,0.98),rgba(24,21,19,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80">
          <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
            For now, feedback is being collected as a simple product inbox placeholder.
          </p>
          <textarea
            rows={6}
            placeholder="Share your note here..."
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 dark:border-stone-700 dark:bg-stone-950/80 dark:text-stone-100 dark:placeholder:text-stone-500"
          />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-white dark:text-black dark:hover:opacity-90"
          >
            Send feedback
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
