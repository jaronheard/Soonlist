"use client";

import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function Page() {
  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center px-4 mt-12 sm:mt-20">
        Only for logged in users
      </main>
      <Footer />
    </div>
  );
}
