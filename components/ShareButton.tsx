"use client";

import { Share } from "lucide-react";
import { toast } from "react-hot-toast";
import { DropdownMenuItem } from "./DropdownMenu";
import { AddToCalendarButtonProps } from "@/types";

export type ShareButtonProps = {
  id: string;
  event: AddToCalendarButtonProps;
};

export function ShareButton(props: ShareButtonProps) {
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${props.event.name} | timetime.cc`,
          text: `(${props.event.startDate} ${props.event.startTime}-${props.event.endTime}) ${props.event.description}`,
          url: `${process.env.NEXT_PUBLIC_URL}/event/${props.id}`,
        });
        console.log("Event shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that do not support the Share API
      navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_URL}/event/${props.id}`
      );
      toast("Event URL copied to clipboard!");
    }
  };

  return (
    <DropdownMenuItem onSelect={handleShareClick}>
      <Share className="mr-2 h-4 w-4" />
      Share
    </DropdownMenuItem>
  );
}