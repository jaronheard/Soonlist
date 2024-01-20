import Image from "next/image";
import { ArrowBigRight } from "lucide-react";
import { api } from "@/trpc/server";
import { type AddToCalendarButtonProps } from "@/types";

export default async function SampleListPhotos({ listId }: { listId: string }) {
  const list = await api.list.get.query({ listId });

  if (!list) {
    return <> </>;
  }
  // limit to 3 events from the end of the array
  const eventData = list.eventToLists.map(
    (item) => item.event.event as AddToCalendarButtonProps
  );
  const events = eventData.slice(-3);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="flex shrink-0 flex-row items-start gap-4 sm:flex-col">
        <Image
          className="h-24 w-24 rounded-lg sm:h-40 sm:w-40"
          alt="Sample image"
          src={events[0]?.images?.[3]!}
          height={160}
          width={160}
        />
        <Image
          className="h-24 w-24 rounded-lg sm:h-40 sm:w-40"
          alt="Sample image"
          src={events[1]?.images?.[3]!}
          height={160}
          width={160}
        />
        <Image
          className="h-24 w-24 rounded-lg sm:h-40 sm:w-40"
          alt="Sample image"
          src={events[2]?.images?.[3]!}
          height={160}
          width={160}
        />
      </div>
      <div className="flex flex-row items-start gap-12 sm:flex-col sm:gap-32">
        <ArrowBigRight className="h-16 w-16 rotate-90 sm:rotate-0" />
        <ArrowBigRight className="h-16 w-16 rotate-90 sm:rotate-0" />
        <ArrowBigRight className="h-16 w-16 rotate-90 sm:rotate-0" />
      </div>
    </div>
  );
}
