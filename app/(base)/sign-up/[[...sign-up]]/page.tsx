import { SignUp } from "@clerk/nextjs";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function Page() {
  return (
    <div className="flex w-full justify-center bg-white">
      <ScrollToTop />
      <SignUp afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/get-started`} />
    </div>
  );
}
