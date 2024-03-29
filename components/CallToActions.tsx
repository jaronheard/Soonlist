"use client";

import React from "react";
import Link from "next/link";
import { CalendarPlus, Star } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <div className="ring-black/10 bg-gradient-to-tr from-yellow-500/10 via-green-500/10 to-blue-500/10 py-4 ring-1 sm:rounded-2xl">
      <div className="w-full px-6 lg:flex lg:items-center lg:justify-between lg:px-8">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          Want to add your own events?
          <br />
          Book a free 1-1 onboarding.
        </h2>
        <div className="mt-2 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
          <CTAButton />
        </div>
      </div>
    </div>
  );
}

export function CTAButton() {
  return (
    <>
      <SignedOut>
        <Button asChild>
          <Link href={"/early-access"}>
            <Star className="mr-2 size-4"></Star>
            Early Access
          </Link>
        </Button>
      </SignedOut>
      <SignedIn>
        <Button asChild>
          <Link href={"/new"}>
            <CalendarPlus className="mr-2 size-4"></CalendarPlus>
            Add<span className="inline">&nbsp;Event</span>
          </Link>
        </Button>
      </SignedIn>
    </>
  );
}
