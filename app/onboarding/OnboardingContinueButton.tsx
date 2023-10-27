"use client";

import React from "react";
import { SignUpButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";

type OnboardingContinueButtonProps = {
  signedOutUrl?: string;
  afterSignInUrl?: string;
  afterSignUpUrl?: string;
};

export default function OnboardingContinueButton({
  signedOutUrl = "/",
  afterSignInUrl = process.env.URL!,
  afterSignUpUrl = process.env.URL!,
}) {
  const { user } = useUser();
  return (
    <>
      <SignedOut>
        <SignUpButton
          afterSignInUrl={afterSignInUrl}
          afterSignUpUrl={afterSignUpUrl}
        >
          <button className="mt-12 block w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-16">
            Sign up &rarr;
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Link
          href={signedOutUrl}
          className="mt-12 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-16"
          as="button"
        >
          Continue &rarr;
        </Link>
      </SignedIn>
    </>
  );
}
