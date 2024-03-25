import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import ImageUpload from "./ImageUpload";
import { YourDetails } from "./YourDetails";
import EventsFromImage from "./EventsFromImage";
import { Stages } from "./Stages";
import AddEvent from "@/app/(base)/AddEvent";
import { AddToCalendarCardSkeleton } from "@/components/AddToCalendarCardSkeleton";
import { api } from "@/trpc/server";

const EventFromRawText = dynamic(() => import("./EventFromRawText"), {
  ssr: false,
});

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
          <EventFromRawText
            timezone={timezone}
            rawText={searchParams.rawText}
          />
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
