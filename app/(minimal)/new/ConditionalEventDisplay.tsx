"use client";

import { useContext, useState } from "react";
import {
  AddToCalendarCard,
  type AddToCalendarCardProps,
} from "@/components/AddToCalendarCard";
import { EventPreview } from "@/components/EventListItem";
import { Mode, ModeContext, Status } from "@/context/ModeContext";

export function ConditionalEventDisplay(initialProps: AddToCalendarCardProps) {
  const [event, setEvent] = useState(initialProps);
  const { mode, status } = useContext(ModeContext);

  if (status === Status.Publish) {
    return <>Publish: final step</>;
  }
  if (status === Status.Organize) {
    return <>Oraganize: middle step</>;
  }

  // Status.Preview
  if (mode === Mode.Edit) {
    return (
      <div className="pb-4">
        <AddToCalendarCard {...event} onUpdate={setEvent} />
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
      event={event}
      visibility="public"
    />
  );
}
