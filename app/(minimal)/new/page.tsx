import { Suspense, lazy } from "react";
import { currentUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import * as Bytescale from "@bytescale/sdk";
import ImageUpload from "./ImageUpload";
import { YourDetails } from "./YourDetails";
import EventsFromImage from "./EventsFromImage";
import EventsFromRawText from "./EventsFromRawText";
import AddEvent from "@/app/(base)/AddEvent";
import { AddToCalendarCardSkeleton } from "@/components/AddToCalendarCardSkeleton";
import { api } from "@/trpc/server";
import FullPageLoadingSpinner from "@/components/FullPageLoadingSpinner";
import { Button } from "@/components/ui/button";

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
      <div className="flex w-full flex-col items-center">
        {/* <YourDetails lists={lists || undefined} /> */}
        {/* <ImageUpload filePath={searchParams.filePath} /> */}
        <header className="fixed inset-x-0 top-2 flex items-center justify-center">
          <ImagePreview filePath={searchParams.filePath} />
        </header>
        <Suspense fallback={<FullPageLoadingSpinner />}>
          <EventsFromRawText
            timezone={timezone}
            rawText={searchParams.rawText}
            filePath={searchParams.filePath}
          />
        </Suspense>
        <footer className="fixed inset-x-0 bottom-0 flex items-center justify-center gap-4 p-4">
          <Button size="lg">Continue</Button>
          <Button size="lg" variant="secondary">
            Edit
          </Button>
        </footer>
      </div>
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

function ImagePreview({ filePath }: { filePath?: string }) {
  if (!filePath) return null;
  const croppedImageUrl = Bytescale.UrlBuilder.url({
    accountId: "12a1yek",
    filePath: filePath, // Ensure filePath is defined and contains the path to the image
    options: {
      transformation: "image",
      transformationParams: {
        w: 48,
        h: 48,
        fit: "min",
        q: 70,
        f: "jpg",
      },
    },
  });
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={croppedImageUrl}
      alt="Image preview"
      className="size-12 rounded-full object-cover"
    />
  );
}
