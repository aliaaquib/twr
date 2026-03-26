import Footer from "@/components/Footer";

export const metadata = {
  title: "About | The Weekly Roundup",
  description: "What The Weekly Roundup is and how it thinks about AI.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <section className="border-b border-stone-200 pb-10 pt-4 dark:border-stone-800">
        <div className="inline-flex rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
          About
        </div>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] text-stone-900 dark:text-stone-100 sm:text-6xl">
          A calmer way to follow AI.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          The Weekly Roundup is built for readers who want signal, not noise. Each issue turns a
          busy AI cycle into one structured read that is clear, fast, and worth remembering.
        </p>
      </section>

      <section className="grid gap-6 py-12 md:grid-cols-3">
        {[
          {
            title: "What changed",
            body: "A clean read on the shifts that actually mattered during the week.",
          },
          {
            title: "Why it matters",
            body: "A sharper idea that helps place those shifts in a bigger frame.",
          },
          {
            title: "What to watch",
            body: "Smaller signals that often say more than the loudest headlines.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(34,30,27,0.98),rgba(24,21,19,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80"
          >
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {item.body}
            </p>
          </article>
        ))}
      </section>

      <section className="max-w-3xl space-y-6 pb-12">
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
          Why this publication exists
        </h2>
        <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
          Most AI coverage swings between hype, speed, and repetition. The Weekly Roundup takes a
          slower editorial approach. It aims to make AI easier to understand without flattening the
          complexity that makes it important.
        </p>
        <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
          The format is intentionally simple: one featured read, a consistent archive of weekly
          pieces, a fast-moving “What’s hot” panel, and topic-led ways to explore the archive.
        </p>
      </section>

      <Footer />
    </div>
  );
}
