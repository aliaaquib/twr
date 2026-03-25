import Link from "next/link";

import { formatDate, getPreview, getReadingTime } from "@/lib/format";

export default function FeaturedCard({ post }) {
  return (
    <article className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(67,56,202,0.24),rgba(15,23,42,0.72))] p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
          Featured
        </span>
      </div>
      <Link href={`/post/${post._id}`} className="mt-6 block">
        <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          {post.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
          {getPreview(post.thisWeek, 220)}
        </p>
        <div className="mt-6 flex items-center gap-4 text-sm text-white/50">
          <span>{formatDate(post.createdAt)}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>{getReadingTime(post)}</span>
        </div>
      </Link>
    </article>
  );
}
