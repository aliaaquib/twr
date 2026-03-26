import Footer from "@/components/Footer";

export const metadata = {
  title: "Graph | The Weekly Roundup",
  description: "A visual view of what The Weekly Roundup has been covering.",
};

export default function GraphPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="border-b border-stone-200 pb-10 pt-4 dark:border-stone-800">
        <div className="inline-flex rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
          Graph
        </div>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] text-stone-900 dark:text-stone-100 sm:text-6xl">
          A quick map of the archive.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          A visual read on where The Weekly Roundup has been spending its attention so far.
        </p>
      </section>

      <section className="mt-24">
        <div className="max-w-xl mx-auto pt-10 text-center space-y-6">
          <p className="text-xs uppercase tracking-widest text-stone-400">
            Coming soon
          </p>
          <h2 className="text-3xl font-semibold text-stone-900 dark:text-stone-100">
            Concept Graph
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-400">
            A new way to navigate ideas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-stone-700 dark:text-stone-300">
            <p className="inline-flex items-center gap-2">
              <span className="text-stone-500 dark:text-stone-400">✓</span>
              <span>Hover to explore connections</span>
            </p>
            <p className="inline-flex items-center gap-2">
              <span className="text-stone-500 dark:text-stone-400">✓</span>
              <span>Click to read insights</span>
            </p>
            <p className="inline-flex items-center gap-2">
              <span className="text-stone-500 dark:text-stone-400">✓</span>
              <span>Drag to shape your view</span>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
