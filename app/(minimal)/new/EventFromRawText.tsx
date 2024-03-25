"use client";

import EventsError from "./EventsError";
import { NewEventPreview } from "./NewEventPreview";
import EventLoadingText from "./EventLoadingText";
import { api } from "@/trpc/react";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import { blankEvent } from "@/lib/utils";

// this is a simple loading spinner component that takes a className prop for sizing

function EventPreviewLoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center ${className} flex-col gap-4 pt-2`}
    >
      <EventLoadingText />
      <div className="size-10 animate-spin rounded-full border-b-2 border-gray-400"></div>
    </div>
  );
}

export default function NewEventFromRawText({
  rawText,
  timezone,
}: {
  rawText: string;
  timezone: string;
}) {
  const fromRawText = api.ai.eventFromRawText.useQuery({
    rawText,
    timezone,
  });

  const { events, response } = fromRawText.data ?? {};

  if (fromRawText.isLoading) {
    return <EventPreviewLoadingSpinner className="h-64" />;
  }

  if (!events || events.length === 0) {
    return (
      <>
        <EventsError rawText={rawText} response={response || undefined} />
        <div className="p-4"></div>
        <AddToCalendarCard {...blankEvent} />
      </>
    );
  }

  if (events.length >= 0) {
    return (
      <div className="flex flex-wrap items-center gap-8">
        {events.length > 0 &&
          events?.map((props) => (
            <NewEventPreview key={props.name} {...props} />
          ))}
        {events.length === 0 && <></>}
      </div>
    );
  }
}
