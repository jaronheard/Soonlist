import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Toaster />
      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {children}
      </main>
      <Footer />
    </>
  );
}
