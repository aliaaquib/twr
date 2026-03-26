"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import SubscribeModal from "@/components/SubscribeModal";

export default function AppShell({ children }) {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <Navbar onSubscribe={() => setIsSubscribeOpen(true)} />
      <main className="mx-auto w-full max-w-7xl px-6 py-14">{children}</main>
      <SubscribeModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
    </div>
  );
}
