"use client";

import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import { type List } from "@/server/db/types";
import { type AddToCalendarButtonProps } from "@/types";
import { AddToCalendarButtonPropsSchema } from "@/types/zodSchema";
import { AddToCalendarCardSkeleton } from "@/components/AddToCalendarCardSkeleton";

const blankEvent = {
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
} as AddToCalendarButtonProps;

export default function EventsFromSaved() {
  const [data, setData] = useState<AddToCalendarButtonProps>(blankEvent);
  const [loadedSavedData, setLoadedSavedData] = useState(false);

  // Utilize the hook
  const [savedData, setSavedData] = useLocalStorage<{
    event: AddToCalendarButtonProps;
    lists: List[];
    notes: string;
    visibility: "public" | "private";
  }>("updatedProps", {
    event: blankEvent,
    lists: [],
    notes: "",
    visibility: "public",
  });

  useEffect(() => {
    const parsedData = AddToCalendarButtonPropsSchema.safeParse(
      savedData.event
    );
    if (parsedData.success) {
      setData(parsedData.data);
    }
    setLoadedSavedData(true);
  }, [savedData]);

  if (!loadedSavedData) {
    return <AddToCalendarCardSkeleton />;
  }
  return <AddToCalendarCard {...data} />;
}
