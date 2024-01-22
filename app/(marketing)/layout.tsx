"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
