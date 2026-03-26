"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatDate } from "@/lib/format";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Featured", value: "featured" },
  { label: "Weekly", value: "weekly" },
];

const getYear = (value) => new Date(value).getFullYear();

export default function ArchiveIndex({ posts }) {
  const [filter, setFilter] = useState("all");

  const filteredPosts = useMemo(() => {
    if (filter === "featured") {
      return posts.filter((post) => post.isFeatured);
    }

    if (filter === "weekly") {
      return posts.filter((post) => !post.isFeatured);
    }

    return posts;
  }, [filter, posts]);

  const groupedPosts = useMemo(() => {
    return filteredPosts.reduce((accumulator, post) => {
      const year = String(getYear(post.createdAt));

      if (!accumulator[year]) {
        accumulator[year] = [];
      }

      accumulator[year].push(post);
      return accumulator;
    }, {});
  }, [filteredPosts]);

  const postNumbers = useMemo(() => {
    return filteredPosts.reduce((accumulator, post, index) => {
      accumulator[post._id] = index + 1;
      return accumulator;
    }, {});
  }, [filteredPosts]);

  const years = Object.keys(groupedPosts).sort((left, right) => Number(right) - Number(left));

  if (filteredPosts.length === 0) {
    return <p className="py-12 text-sm text-stone-500 dark:text-stone-400">No archived articles yet.</p>;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const isActive = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-stone-800 bg-stone-800 text-stone-50 dark:border-stone-200 dark:bg-stone-100 dark:text-stone-950"
                  : "border-stone-300 text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-10">
        {years.map((year) => (
          <section key={year} className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              {year}
            </h2>

            <div>
              {groupedPosts[year].map((post) => (
                <Link
                  key={post._id}
                  href={`/post/${post._id}`}
                  className="group flex cursor-pointer items-start justify-between gap-6 border-b border-stone-200 py-3 transition hover:bg-stone-100/70 dark:border-stone-700 dark:hover:bg-stone-700/20"
                >
                  <div className="min-w-0">
                    <h3 className="text-base font-medium text-stone-900 transition group-hover:underline dark:text-stone-100">
                      {postNumbers[post._id]}. {post.title}
                    </h3>
                  </div>
                  <div className="shrink-0 text-xs text-stone-500 dark:text-stone-400">
                    {post.isFeatured ? "Featured" : formatDate(post.createdAt)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
