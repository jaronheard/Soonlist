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
  params: {};
  searchParams: {
    rawText?: string;
    saveIntent?: boolean;
    filePath?: string;
    timezone?: string;
  };
};

export default async function Page({ params, searchParams }: Props) {
  const user = await currentUser();
  const username = user?.username;
  const lists =
    username &&
    (await api.list.getAllForUser.query({
      userName: username,
    }));
  const timezone = searchParams.timezone || "America/Los_Angeles"; // todo: get from user

  if (searchParams.saveIntent) {
    return (
      <>
        <YourDetails lists={lists || undefined} />
        <div className="p-4"></div>
        <ImageUpload filePath={searchParams.filePath} />
        <div className="p-4"></div>
        <Suspense fallback={<AddToCalendarCardSkeleton />}>
          <EventsFromSaved />
        </Suspense>
      </>
    );
  }

  if (searchParams.filePath && !searchParams.rawText) {
    return (
      <>
        <YourDetails lists={lists || undefined} />
        <div className="p-4"></div>
        <ImageUpload filePath={searchParams.filePath} />
        <div className="p-4"></div>
        <Suspense fallback={<AddToCalendarCardSkeleton />}>
          <EventsFromImage
            timezone={timezone}
            filePath={searchParams.filePath}
          />
        </Suspense>
      </>
    );
  }

  if (!searchParams.rawText) {
    return (
      <>
        <Suspense>
          <AddEvent lists={lists || undefined} />
        </Suspense>
      </>
    );
  }

  if (searchParams.rawText) {
    return (
      <>
        <YourDetails lists={lists || undefined} />
        <div className="p-4"></div>
        <ImageUpload filePath={searchParams.filePath} />
        <div className="p-4"></div>
        <Suspense fallback={<AddToCalendarCardSkeleton />}>
          <EventsFromRawText
            timezone={timezone}
            rawText={searchParams.rawText}
          />
        </Suspense>
      </>
    );
  }
}
