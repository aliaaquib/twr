import "./globals.css";

import Navbar from "@/components/Navbar";

export const metadata = {
  title: "The Weekly Roundup",
  description: "A minimal AI editorial site for thoughtful, original articles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
          <Navbar />
          <main className="mx-auto w-full max-w-7xl px-6 py-14">{children}</main>
        </div>
      </body>
    </html>
  );
}
