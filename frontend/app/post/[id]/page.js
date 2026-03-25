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
    <article className="mx-auto max-w-[760px] rounded-[36px] border border-white/10 bg-white/[0.04] px-6 py-10 shadow-[0_24px_64px_rgba(0,0,0,0.25)] backdrop-blur sm:px-10 sm:py-14">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-sm font-medium text-white/45">{post.week}</div>
        {post.isFeatured ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9aa6ff]">
            Featured
          </span>
        ) : null}
      </div>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
        {post.title}
      </h1>
      <div className="mt-4 text-sm text-white/38">{formatDate(post.createdAt)}</div>

      <div className="mt-12 space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-white">This week in AI</h2>
          <p className="text-lg leading-9 text-white/72">{post.thisWeek}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            One idea that matters
          </h2>
          <p className="text-lg leading-9 text-white/72">{post.idea}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Signals</h2>
          <ul className="space-y-3 pl-5 text-lg leading-8 text-white/72 marker:text-[#92a0ff]">
            {post.signals.map((signal, index) => (
              <li key={`${post._id}-signal-${index}`}>{signal}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
