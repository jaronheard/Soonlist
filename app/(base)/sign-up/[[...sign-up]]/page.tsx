import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex w-full justify-center bg-white">
      <SignUp afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/get-started`} />
    </div>
  );
}
