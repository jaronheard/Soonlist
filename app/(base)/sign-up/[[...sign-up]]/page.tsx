import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <SignUp
        afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/getting-started`}
      />
    </div>
  );
}
