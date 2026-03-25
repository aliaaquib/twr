import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-[32px] border border-white/10 bg-white/[0.04] p-10 text-center shadow-[0_24px_64px_rgba(0,0,0,0.25)]">
      <h1 className="text-3xl font-semibold text-white">Article not found</h1>
      <p className="mt-4 text-base leading-7 text-white/52">
        This story may have been removed or the link may be incorrect.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5"
      >
        Back to homepage
      </Link>
    </div>
  );
}
