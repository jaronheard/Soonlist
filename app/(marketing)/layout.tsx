"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <Toaster />
      {children}
      <Footer />
    </div>
  );
}
