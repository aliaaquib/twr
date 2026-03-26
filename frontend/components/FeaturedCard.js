import Link from "next/link";

import { formatDate, getPreview, getReadingTime } from "@/lib/format";

export default function FeaturedCard({ post }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:brightness-[0.99] dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(28,25,23,0.98),rgba(18,16,15,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80 dark:hover:brightness-105">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-600 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300">
          Featured
        </span>
      </div>
      <Link href={`/post/${post._id}`} className="mt-6 block">
        <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-stone-900 dark:text-stone-100 sm:text-5xl">
          {post.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          {getPreview(post.thisWeek, 220)}
        </p>
        <div className="mt-6 flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
          <span>{formatDate(post.createdAt)}</span>
          <span className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-600" />
          <span>{getReadingTime(post)}</span>
        </div>
      </Link>
    </article>
  );
}
