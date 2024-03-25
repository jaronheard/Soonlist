import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <main className="mx-auto min-h-[calc(100vh-4.5rem)] w-full max-w-7xl px-6 py-16 sm:min-h-[calc(100vh-5.75rem)] lg:px-8 lg:py-24">
        {children}
      </main>
    </>
  );
}
