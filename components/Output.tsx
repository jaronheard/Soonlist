"use client";
import { type AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useEffect, useRef } from "react";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";

export function Output({
  events,
  finished,
  setEvents,
}: {
  events: AddToCalendarButtonType[] | null;
  finished: boolean;
  setEvents: (events: AddToCalendarButtonType[] | null) => void;
}) {
  const firstInputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    // If finished is true, focus on the input
    if (finished && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [finished]);

  const eventsAreValid = finished && events && events.length > 0;
  const blankEvents = [
    {
      options: [
        "Apple",
        "Google",
        "iCal",
        "Microsoft365",
        "MicrosoftTeams",
        "Outlook.com",
        "Yahoo",
      ] as
        | (
            | "Apple"
            | "Google"
            | "iCal"
            | "Microsoft365"
            | "MicrosoftTeams"
            | "Outlook.com"
            | "Yahoo"
          )[]
        | undefined,
      buttonStyle: "text" as const,
      name: "Manual entry" as const,
      description: "" as const,
      location: "" as const,
      startDate: "today" as const,
      endDate: "" as const,
      startTime: "" as const,
      endTime: "" as const,
      timeZone: "" as const,
    } as AddToCalendarButtonType,
  ];

  return (
    <output className="">
      {finished && (
        <>
          {eventsAreValid && (
            <div className="flex flex-wrap justify-center gap-4">
              {events?.map((props, index) => (
                <AddToCalendarCard
                  {...props}
                  key={props.name}
                  firstInputRef={index === 0 ? firstInputRef : undefined}
                  setAddToCalendarButtonProps={(props) => {
                    const newArray = [...events];
                    newArray[index] = props;
                    setEvents(newArray);
                  }}
                  update={false}
                />
              ))}
            </div>
          )}
          {!eventsAreValid && (
            <div className="flex flex-wrap justify-center gap-4">
              {blankEvents?.map((props, index) => (
                <AddToCalendarCard
                  {...props}
                  key={props.name}
                  firstInputRef={index === 0 ? firstInputRef : undefined}
                  setAddToCalendarButtonProps={(props) => {
                    const newArray = [...blankEvents];
                    newArray[index] = props;
                    setEvents(newArray);
                  }}
                  update={false}
                />
              ))}
            </div>
          )}
        </>
      )}
    </output>
  );
}
