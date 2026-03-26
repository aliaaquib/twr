import "./globals.css";

import AppShell from "@/components/AppShell";

export const metadata = {
  title: "The Weekly Roundup",
  description: "A minimal AI editorial site for thoughtful, original articles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
