"use client";

import { useContext, useEffect, useState } from "react";
import {
  AddToCalendarCard,
  type AddToCalendarCardProps,
} from "@/components/AddToCalendarCard";
import { EventPreview } from "@/components/EventListItem";
import { Mode, ModeContext } from "@/context/ModeContext";
import { useFormContext } from "@/context/FormContext";

export function NewEventPreview(initialProps: AddToCalendarCardProps) {
  const [event, setEvent] = useState(initialProps);
  const { mode } = useContext(ModeContext);
  const { eventData, setEventData } = useFormContext();

  useEffect(() => {
    setEventData(event);
  }, [event, setEventData]);

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
