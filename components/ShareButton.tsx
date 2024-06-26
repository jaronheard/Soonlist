"use client";

import { Share } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "./DropdownMenu";
import { Button } from "./ui/button";
import { type AddToCalendarButtonProps } from "@/types";

export type ShareButtonProps = {
  id: string;
  event: AddToCalendarButtonProps;
  type: "button" | "dropdown" | "icon";
};

export function ShareButton(props: ShareButtonProps) {
  // TODO: Add support for all day events
  const isAllDay = props.event.startTime && props.event.endTime ? false : true;
  const shareText = isAllDay
    ? `(${props.event.startDate} ${props.event.description}`
    : `(${props.event.startDate} ${props.event.startTime}-${props.event.endTime}) ${props.event.description}`;

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${props.event.name} | Soonlist`,
          text: shareText,
          url: `${process.env.NEXT_PUBLIC_URL}/event/${props.id}`,
        });
        console.log("Event shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that do not support the Share API
      void navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_URL}/event/${props.id}`
      );
      toast("Event URL copied to clipboard!");
    }
  };

  if (props.type === "button") {
    return (
      <Button onClick={handleShareClick}>
        <Share className="mr-2 size-4" />
        Share
      </Button>
    );
  }
  if (props.type === "dropdown") {
    return (
      <DropdownMenuItem onSelect={handleShareClick}>
        <Share className="mr-2 size-4" />
        Share
      </DropdownMenuItem>
    );
  }
  if (props.type === "icon") {
    return (
      <Button onClick={handleShareClick} size={"icon"}>
        <Share className="size-6" />
      </Button>
    );
  }
}
