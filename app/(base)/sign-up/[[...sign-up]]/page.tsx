import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-white">
      <SignUp />
    </div>
  );
}
