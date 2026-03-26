export default function Loading() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-stone-200 bg-white p-12 text-center dark:border-stone-800 dark:bg-stone-900">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700 dark:border-stone-800 dark:border-t-stone-200" />
      <p className="mt-5 text-base text-stone-600 dark:text-stone-400">Loading the latest stories...</p>
    </div>
  );
}
