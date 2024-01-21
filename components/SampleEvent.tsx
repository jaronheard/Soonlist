import Image from "next/image";
import { ArrowBigRight } from "lucide-react";
import { Event } from "./Event";
import { api } from "@/trpc/server";
import { type AddToCalendarButtonPropsRestricted } from "@/types";

export default async function SampleEvent({ eventId }: { eventId: string }) {
  const event = await api.event.get.query({
    eventId,
  });

  const eventData = event?.event as AddToCalendarButtonPropsRestricted;
  const fullImageUrl = eventData?.images?.[3];

  if (!event || !eventData) {
    return null;
  }

  return (
    <div className="relative mx-auto flex min-h-0 max-w-7xl flex-col place-items-center sm:flex-row">
      {fullImageUrl && (
        <Image
          src={fullImageUrl}
          className="ring-dashed mx-auto size-auto max-h-80 rounded-xl object-cover shadow-sm outline-dashed outline-2 outline-offset-4 outline-gray-100"
          alt=""
          width={640}
          height={480}
        />
      )}
      <div className="flex sm:flex-row">
        <ArrowBigRight className="size-16 rotate-90 sm:rotate-0" />
      </div>
      <div className="grid place-items-center rounded-xl border-2 border-gray-100 bg-white text-left shadow-md">
        <Event
          user={event.user}
          eventFollows={event.eventFollows}
          comments={event.comments}
          key={event.id}
          id={event.id}
          event={eventData}
          createdAt={event.createdAt}
          visibility={event.visibility}
        />
      </div>
      <div className="absolute inset-x-0 -bottom-12 z-50 mx-auto block w-max max-w-full rounded-lg bg-yellow-50 p-2 px-3 py-1 text-sm leading-6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
        <div>
          ✨ All the details here were automatically captured from the image, no
          typing required!
        </div>
      </div>
    </div>
  );
}
