import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-white/8 bg-[#09090b]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-sm font-semibold tracking-[0.18em] text-white uppercase">
          The Weekly Roundup
        </Link>
        <nav className="flex items-center gap-5 text-sm text-white/55">
          <Link href="/" className="transition hover:text-white">
            Archive
          </Link>
          <Link href="/admin" className="transition hover:text-white">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
