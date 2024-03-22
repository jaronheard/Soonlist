"use client";

import { useContext } from "react";
import {
  AddToCalendarCard,
  type AddToCalendarCardProps,
} from "@/components/AddToCalendarCard";
import { EventPreview } from "@/components/EventListItem";
import { ModeContext } from "@/context/ModeContext";

export function ConditionalEventDisplay(props: AddToCalendarCardProps) {
  const { mode } = useContext(ModeContext);
  if (mode === "edit") {
    return (
      <div className="pb-4">
        <AddToCalendarCard {...props} hideButtons />
      </div>
    );
  }
  return (
    <EventPreview
      user={undefined}
      eventFollows={[]}
      comments={[]}
      id={""}
      createdAt={undefined}
      event={props}
      visibility="public"
    />
  );
}
