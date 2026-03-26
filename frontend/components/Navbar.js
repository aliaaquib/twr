"use client";

import Link from "next/link";
import { useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/graph", label: "Graph" },
  { href: "/topics", label: "Topics" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/95 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
      <div className="mx-auto w-full max-w-5xl px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100"
            onClick={() => setIsOpen(false)}
          >
            The Weekly Roundup
          </Link>

          <div className="flex items-center gap-3">
            <div className="shrink-0 md:hidden">
              <ThemeToggle />
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-900 md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
            >
              <span aria-hidden="true" className="text-sm">
                {isOpen ? "✕" : "☰"}
              </span>
            </button>

            <nav className="hidden items-center gap-4 text-sm text-stone-500 dark:text-stone-400 md:flex">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-stone-900 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="ml-2 shrink-0">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>

        {isOpen ? (
          <nav className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400 md:hidden">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-2 py-2 transition hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-900 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
