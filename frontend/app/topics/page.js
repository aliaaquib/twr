import Link from "next/link";

import Footer from "@/components/Footer";
import { fetchFeaturedPost, fetchPosts } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { groupPostsByTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Topics | The Weekly Roundup",
  description: "Explore The Weekly Roundup archive by topic.",
};

export default async function TopicsPage() {
  const [featuredPost, posts] = await Promise.all([fetchFeaturedPost(), fetchPosts()]);
  const allPosts = [featuredPost, ...posts].filter(Boolean);
  const groups = groupPostsByTopic(allPosts);

  return (
    <div className="mx-auto max-w-5xl">
      <section className="border-b border-stone-200 pb-10 pt-4 dark:border-stone-800">
        <div className="inline-flex rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
          Topics
        </div>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] text-stone-900 dark:text-stone-100 sm:text-6xl">
          Browse the archive by theme.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          Every article is grouped into a clearer editorial thread so readers can follow the ideas
          that matter most to them.
        </p>
      </section>

      <section className="py-12 space-y-8">
        {groups.map((group) => (
          <article
            key={group.topic}
            className="rounded-xl border border-stone-200 bg-stone-50 p-6 dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(34,30,27,0.98),rgba(24,21,19,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4 dark:border-stone-800">
              <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                {group.topic}
              </h2>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                {group.posts.length} article{group.posts.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {group.posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/post/${post._id}`}
                  className="block border-b border-stone-200 pb-4 last:border-b-0 last:pb-0 dark:border-stone-800"
                >
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="text-base font-medium text-stone-900 transition hover:text-stone-950 dark:text-stone-100 dark:hover:text-white">
                      {post.title}
                    </h3>
                    <span className="shrink-0 text-xs text-stone-500 dark:text-stone-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <Footer />
    </div>
  );
}
