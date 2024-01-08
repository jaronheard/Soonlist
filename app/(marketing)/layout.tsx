"use client";

import { Suspense } from "react";
import { UserProvider } from "../providers";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mx-auto max-w-5xl">
        <Suspense>
          <UserProvider>
            <Header />
          </UserProvider>
        </Suspense>
      </div>
      {children}
      <div className="mx-auto max-w-5xl">
        <Footer />
      </div>
    </div>
  );
}
