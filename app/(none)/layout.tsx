import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <main className="">{children}</main>
    </>
  );
}
