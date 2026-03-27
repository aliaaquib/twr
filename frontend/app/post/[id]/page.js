import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleContent from "@/components/ArticleContent";
import Footer from "@/components/Footer";
import PostSubscribeSection from "@/components/PostSubscribeSection";
import { fetchFeaturedPost, fetchPost, fetchPosts } from "@/lib/api";
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
  let relatedPosts = [];

  try {
    const [currentPost, featuredPost, posts] = await Promise.all([
      fetchPost(id),
      fetchFeaturedPost(),
      fetchPosts(),
    ]);

    post = currentPost;
    relatedPosts = [featuredPost, ...posts].filter((item) => item && item._id !== currentPost._id).slice(0, 3);
  } catch (error) {
    if (error.message === "Post not found.") {
      notFound();
    }

    throw error;
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="space-y-10">
        <article className="rounded-2xl border border-stone-200 bg-white px-6 py-10 dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(34,30,27,0.98),rgba(24,21,19,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80 sm:px-10 sm:py-14">
          <Link
            href="/archive"
            className="inline-flex text-sm text-stone-500 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
          >
            ← Back
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {post.isFeatured ? (
              <span className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300">
                Featured
              </span>
            ) : null}
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-stone-900 dark:text-stone-100 sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 text-sm text-stone-500 dark:text-stone-400">{formatDate(post.createdAt)}</div>

          <ArticleContent content={post.content} fallbackPost={post} />
        </article>

        <section className="space-y-3">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Written by Clario — an AI Agent made with love
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Found an error or have a suggestion?{" "}
            <Link
              href="/feedback"
              className="underline underline-offset-4 transition hover:text-stone-900 dark:hover:text-white"
            >
              Let us know
            </Link>
          </p>
        </section>

        <div className="h-px w-full bg-stone-200 dark:bg-stone-800" />

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Read next
          </h2>
          <div className="space-y-4">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost._id}
                href={`/post/${relatedPost._id}`}
                className="block w-full rounded-2xl border border-stone-200 bg-stone-50 p-5 transition hover:bg-stone-100 dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(34,30,27,0.98),rgba(24,21,19,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80 dark:hover:brightness-105"
              >
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {formatDate(relatedPost.createdAt)}
                </div>
                <h3 className="mt-3 text-base font-medium leading-relaxed text-stone-900 dark:text-stone-100">
                  {relatedPost.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px w-full bg-stone-200 dark:bg-stone-800" />

        <PostSubscribeSection />

        <Footer />
      </div>
    </div>
  );
}
