import { SignIn } from "@clerk/nextjs";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function Page() {
  return (
    <div className="flex w-full justify-center bg-white">
      <ScrollToTop />
      <SignIn />
    </div>
  );
}
