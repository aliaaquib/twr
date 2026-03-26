import { notFound } from "next/navigation";

import { fetchPost } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const post = await fetchPost(id);

    return {
      title: `${post.title} | The Weekly Roundup`,
      description: post.thisWeek.slice(0, 150),
    };
  } catch {
    return {
      title: "Article | The Weekly Roundup",
    };
  }
}

export default async function PostPage({ params }) {
  const { id } = await params;
  let post;

  try {
    post = await fetchPost(id);
  } catch (error) {
    if (error.message === "Post not found.") {
      notFound();
    }

    throw error;
  }

  return (
    <article className="mx-auto max-w-[760px] rounded-2xl border border-stone-200 bg-white px-6 py-10 dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(34,30,27,0.98),rgba(24,21,19,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80 sm:px-10 sm:py-14">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-sm font-medium text-stone-500 dark:text-stone-400">{post.week}</div>
        {post.isFeatured ? (
          <span className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300">
            Featured
          </span>
        ) : null}
      </div>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-stone-900 dark:text-stone-100 sm:text-5xl">
        {post.title}
      </h1>
      <div className="mt-4 text-sm text-stone-500 dark:text-stone-400">{formatDate(post.createdAt)}</div>

      <div className="mt-12 space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">This week in AI</h2>
          <p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">{post.thisWeek}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            One idea that matters
          </h2>
          <p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">{post.idea}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">Signals</h2>
          <ul className="space-y-3 pl-5 text-lg leading-relaxed text-stone-700 marker:text-stone-500 dark:text-stone-300 dark:marker:text-stone-400">
            {post.signals.map((signal, index) => (
              <li key={`${post._id}-signal-${index}`}>{signal}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
