import { Suspense, lazy } from "react";
import { currentUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import ImageUpload from "./ImageUpload";
import { YourDetails } from "./YourDetails";
import EventsFromImage from "./EventsFromImage";
import EventLoadingText from "./EventLoadingText";
import { Stages } from "./Stages";
import AddEvent from "@/app/(base)/AddEvent";
import { AddToCalendarCardSkeleton } from "@/components/AddToCalendarCardSkeleton";
import { api } from "@/trpc/server";

const EventsFromRawText = lazy(() => import("./EventsFromRawText"));

const EventsFromSaved = dynamic(() => import("./EventsFromSaved"), {
  ssr: false,
});

export const maxDuration = 60;

type Props = {
  searchParams: {
    rawText?: string;
    saveIntent?: boolean;
    filePath?: string;
    timezone?: string;
    edit?: boolean;
  };
};

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

export default async function Page({ searchParams }: Props) {
  const user = await currentUser();
  const username = user?.username;
  const lists =
    username &&
    (await api.list.getAllForUser.query({
      userName: username,
    }));
  const timezone = searchParams.timezone || "America/Los_Angeles";

  // saved event
  if (searchParams.saveIntent) {
    return (
      <Suspense>
        <div className="flex w-full flex-col items-center gap-8">
          <YourDetails lists={lists || undefined} />
          <ImageUpload filePath={searchParams.filePath} />
          <EventsFromSaved />
        </div>
      </Suspense>
    );
  }

  // image only
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

  // text (with or without image)
  if (searchParams.rawText) {
    return (
      <Stages
        filePath={searchParams.filePath}
        lists={lists || undefined}
        Preview={
          <Suspense
            fallback={<EventPreviewLoadingSpinner className="size-screen" />}
          >
            <EventsFromRawText
              timezone={timezone}
              rawText={searchParams.rawText}
              filePath={searchParams.filePath}
              edit={searchParams.edit}
            />
          </Suspense>
        }
      ></Stages>
    );
  }

  // default
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <YourDetails lists={lists || undefined} />
      <AddEvent />
    </div>
  );
}
