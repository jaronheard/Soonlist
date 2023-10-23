"use client";

import React from "react";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { SignedIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import clsx from "clsx";

export function SaveButton(props: AddToCalendarButtonType) {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onClick() {
    setIsLoading(true);

    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: props,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("Your event was not saved. Please try again.");
    }

    const event = await response.json();

    // This forces a cache invalidation.
    router.refresh();

    router.push(`/events/${user?.id || ""}`);
  }

  return (
    <SignedIn>
      <button
        className={clsx(
          "bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full",
          {
            "cursor-not-allowed opacity-60": isLoading,
          }
        )}
        onClick={onClick}
      >
        {isLoading ? (
          <span className="loading">
            <span style={{ backgroundColor: "white" }} />
            <span style={{ backgroundColor: "white" }} />
            <span style={{ backgroundColor: "white" }} />
          </span>
        ) : (
          "Save"
        )}
      </button>
    </SignedIn>
  );
}