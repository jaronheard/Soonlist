import { Suspense, lazy } from "react";
import { currentUser } from "@clerk/nextjs";
import AddEvent from "../AddEvent";
import ImageUpload from "./ImageUpload";
import EventsFromSaved from "./EventsFromSaved";
import { YourDetails } from "./YourDetails";
import EventsFromImage from "./EventsFromImage";
import { AddToCalendarCardSkeleton } from "@/components/AddToCalendarCardSkeleton";
import { api } from "@/trpc/server";

const EventsFromRawText = lazy(() => import("./EventsFromRawText"));

export const maxDuration = 60;

type Props = {
  searchParams: {
    rawText?: string;
    saveIntent?: boolean;
    filePath?: string;
    timezone?: string;
  };
};

export default async function Page({ searchParams }: Props) {
  const user = await currentUser();
  const username = user?.username;
  const lists =
    username &&
    (await api.list.getAllForUser.query({
      userName: username,
    }));
  const timezone = searchParams.timezone || "America/Los_Angeles";

  if (searchParams.saveIntent) {
    return (
      <div className="flex w-full flex-col items-center gap-8">
        <YourDetails lists={lists || undefined} />
        <ImageUpload filePath={searchParams.filePath} />
        <Suspense fallback={<AddToCalendarCardSkeleton />}>
          <EventsFromSaved />
        </Suspense>
      </div>
    );
  }

  if (searchParams.filePath && !searchParams.rawText) {
    return (
      <div className="flex w-full flex-col items-center gap-8">
        <YourDetails lists={lists || undefined} />
        <ImageUpload filePath={searchParams.filePath} />
        <Suspense fallback={<AddToCalendarCardSkeleton />}>
          <EventsFromImage
            timezone={timezone}
            filePath={searchParams.filePath}
          />
        </Suspense>
      </div>
    );
  }

  if (!searchParams.rawText) {
    return (
      <div className="flex w-full flex-col items-center gap-8">
        <Suspense>
          <AddEvent lists={lists || undefined} />
        </Suspense>
      </div>
    );
  }

  if (searchParams.rawText) {
    return (
      <div className="flex w-full flex-col items-center gap-8">
        <YourDetails lists={lists || undefined} />
        <ImageUpload filePath={searchParams.filePath} />
        <Suspense fallback={<AddToCalendarCardSkeleton />}>
          <EventsFromRawText
            timezone={timezone}
            rawText={searchParams.rawText}
          />
        </Suspense>
      </div>
    );
  }
}
