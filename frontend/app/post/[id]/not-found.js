import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
      <h1 className="text-3xl font-semibold text-stone-900 dark:text-stone-100">Article not found</h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">
        This story may have been removed or the link may be incorrect.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-100 dark:border-stone-800 dark:text-stone-100 dark:hover:bg-stone-900"
      >
        Back to homepage
      </Link>
    </div>
  );
}
