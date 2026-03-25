import "./globals.css";

import Navbar from "@/components/Navbar";

export const metadata = {
  title: "The Weekly Roundup",
  description: "A minimal AI editorial site for thoughtful, original articles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen">
          <div className="absolute inset-0 -z-20 bg-[#09090b]" />
          <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,rgba(92,108,255,0.24),transparent_60%)]" />
          <div className="absolute inset-y-0 right-0 -z-10 w-[38vw] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_60%)]" />
          <Navbar />
          <main className="mx-auto w-full max-w-7xl px-6 py-14">{children}</main>
        </div>
      </body>
    </html>
  );
}
