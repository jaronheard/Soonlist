import Link from "next/link";
import Logo from "./Logo";

export default function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-50 bg-interactive-3">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between pb-4 pl-2 pt-3 sm:px-4 sm:pb-7 sm:pt-5">
        <div className="flex animate-pulse items-center sm:grow sm:gap-0">
          <Link href="/" className="relative flex items-center">
            <Logo variant="hidePreview" className="block sm:hidden" />
            <Logo className="hidden sm:block" />
          </Link>
        </div>
        <div className="flex shrink-0 sm:gap-5">
          <div className="h-8 w-60 rounded-xl bg-gray-50"></div>
        </div>
      </header>
    </div>
  );
}
