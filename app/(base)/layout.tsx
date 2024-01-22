import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Toaster />
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center">
        <main className="my-12 flex w-full flex-1 flex-col items-center justify-center sm:my-20 sm:px-4">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
