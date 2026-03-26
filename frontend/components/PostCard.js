import Link from "next/link";

import { formatDate, getReadingTime } from "@/lib/format";

export default function PostCard({ post }) {
  return (
    <Link
      href={`/post/${post._id}`}
      className="group block border-b border-stone-200 py-3 transition hover:bg-stone-100/70 dark:border-stone-800 dark:hover:bg-stone-800/35"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-base font-medium tracking-tight text-stone-900 transition group-hover:text-stone-950 group-hover:underline dark:text-stone-100 dark:group-hover:text-white">
            {post.title}
          </h3>
        </div>
        <div className="shrink-0 pt-1 text-xs text-stone-500 dark:text-stone-400">{formatDate(post.createdAt)}</div>
      </div>
      <div className="mt-1 text-xs text-stone-500 dark:text-stone-400">{getReadingTime(post)}</div>
    </Link>
  );
}
