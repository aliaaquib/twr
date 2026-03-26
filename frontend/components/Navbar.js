import Link from "next/link";

import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/95 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100"
        >
          The Weekly Roundup
        </Link>
        <nav className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
          <Link href="/" className="transition hover:text-stone-900 dark:hover:text-white">
            Archive
          </Link>
          <Link href="/admin" className="transition hover:text-stone-900 dark:hover:text-white">
            Admin
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
