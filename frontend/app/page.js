import ArticlesList from "@/components/ArticlesList";
import Footer from "@/components/Footer";
import FeaturedCard from "@/components/FeaturedCard";
import HotPanel from "@/components/HotPanel";
import NextInTwrSection from "@/components/NextInTwrSection";
import NextArticleCountdown from "@/components/NextArticleCountdown";
import NewsletterCard from "@/components/NewsletterCard";
import TodaysFactCard from "@/components/TodaysFactCard";
import { fetchFeaturedPost, fetchHotItems, fetchPosts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredPost, posts, hotItems] = await Promise.all([
    fetchFeaturedPost(),
    fetchPosts(),
    fetchHotItems(),
  ]);
  const allPosts = [featuredPost, ...posts].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl">
      <section className="pb-10 pt-4">
        <div className="inline-flex rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
          Weekly editorial brief
        </div>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-stone-900 dark:text-stone-100 sm:text-6xl">
          A sharper read on the week in AI.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-400">
          Featured analysis at the top, weekly issues underneath, and a fast-moving panel of
          what the ecosystem is talking about right now.
        </p>
        <div className="mt-8 h-px w-full bg-stone-200 dark:bg-stone-700" />
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="space-y-8">
          {posts.length > 0 ? (
            <div className="flex items-center justify-between gap-4 text-sm text-stone-500 dark:text-stone-400">
              <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-2xl">
                <span>📚</span>
                <span>Explore</span>
              </h3>
              <a
                href="#all-articles"
                className="text-sm transition hover:text-stone-900 dark:hover:text-white"
              >
                all articles
              </a>
            </div>
          ) : null}

          {featuredPost ? (
            <div className="space-y-3">
              <FeaturedCard post={featuredPost} />
              <NextArticleCountdown
                latestWeeklyArticleDate={posts[0]?.createdAt || null}
                latestWeeklyArticleWeek={posts[0]?.week || null}
              />
            </div>
          ) : null}

          <section id="all-articles">
            <ArticlesList posts={posts} />
          </section>
        </div>

        <aside className="space-y-6">
          <HotPanel items={hotItems} />
          <NewsletterCard />
          <TodaysFactCard posts={allPosts} />
        </aside>
      </div>

      <NextInTwrSection />
      <Footer />
    </div>
  );
}
