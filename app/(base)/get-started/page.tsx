import { CheckCircle2, CircleDashed, Pen } from "lucide-react";
import { OnboardingTabs } from "./OnboardingTabs";
import { cn } from "@/lib/utils";

export function ProgressIcon({
  status,
  className,
}: {
  status: "complete" | "active" | "incomplete";
  className?: string;
}) {
  const commonClasses = "mr-2 size-4";

  if (status === "complete") {
    return <CheckCircle2 className={cn(commonClasses, className)} />;
  }
  if (status === "active") {
    return <Pen className={cn(commonClasses, className)} />;
  }
  if (status === "incomplete") {
    return <CircleDashed className={cn(commonClasses, className)} />;
  }
  return null;
}

export const metadata = {
  title: "Get Started | Soonlist",
  openGraph: {
    title: "Get Started | Soonlist",
  },
};

// TODO: this page needs an overhaul. Also a lot of the content is duplicated on the about page

export default function Page() {
  return <OnboardingTabs />;
}
