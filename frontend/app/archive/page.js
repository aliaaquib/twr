import ArchiveIndex from "@/components/ArchiveIndex";
import Footer from "@/components/Footer";
import { fetchFeaturedPost, fetchPosts } from "@/lib/api";
import { dedupePosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Archive | The Weekly Roundup",
  description: "All published insights, organized for exploration.",
};

export default async function ArchivePage() {
  const [featuredPost, posts] = await Promise.all([fetchFeaturedPost(), fetchPosts()]);
  const allPosts = dedupePosts([featuredPost, ...posts].filter(Boolean))
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  return (
    <div className="mx-auto max-w-2xl">
      <section className="border-b border-stone-200 pb-10 pt-4 dark:border-stone-800">
        <div className="inline-flex rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
          Archive
        </div>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] text-stone-900 dark:text-stone-100 sm:text-6xl">
          Archive
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          All published insights, organized for exploration.
        </p>
      </section>

      <section className="py-12">
        <ArchiveIndex posts={allPosts} />
      </section>

      <Footer />
    </div>
  );
}
