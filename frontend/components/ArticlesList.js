"use client";

import { useMemo, useState } from "react";

import PostCard from "@/components/PostCard";

const DEFAULT_VISIBLE_COUNT = 12;

export default function ArticlesList({ posts }) {
  const [showAll, setShowAll] = useState(false);
  const totalCount = posts.length;
  const hasMoreThanDefault = totalCount > DEFAULT_VISIBLE_COUNT;

  const visiblePosts = useMemo(() => {
    if (showAll || !hasMoreThanDefault) {
      return posts;
    }

    return posts.slice(0, DEFAULT_VISIBLE_COUNT);
  }, [hasMoreThanDefault, posts, showAll]);

  if (totalCount === 0) {
    return <div className="py-8 text-sm text-stone-500 dark:text-stone-400">No articles yet</div>;
  }

  return (
    <div>
      {visiblePosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {hasMoreThanDefault ? (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="pt-4 text-sm text-stone-500 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
        >
          {showAll ? "show fewer articles" : `read all ${totalCount} articles`}
        </button>
      ) : null}
    </div>
  );
}
