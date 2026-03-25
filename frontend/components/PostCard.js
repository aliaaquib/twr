import Link from "next/link";

import { formatDate, getReadingTime } from "@/lib/format";

export default function PostCard({ post }) {
  return (
    <Link
      href={`/post/${post._id}`}
      className="group block py-2 transition"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-base font-medium tracking-tight text-white transition group-hover:text-white group-hover:underline">
            {post.title}
          </h3>
        </div>
        <div className="shrink-0 pt-1 text-xs text-white/38">{formatDate(post.createdAt)}</div>
      </div>
      <div className="mt-0.5 text-xs text-white/30">{getReadingTime(post)}</div>
    </Link>
  );
}
