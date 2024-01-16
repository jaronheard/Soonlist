import Link from "next/link";
import Image from "next/image";
import { ArrowBigRight, Sparkle, Wand } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { EventCard } from "./EventCardNew";
import EventList from "@/components/EventList";
import { api } from "@/trpc/server";
import { AddToCalendarButtonProps } from "@/types";

export default async function SampleEvent({} = {}) {
  const devSampleEventId = "clrg63xn20001zyzg6gnwzktg";
  const prodSampleEventId = "clrg63xn20001zyzg6gnwzktg";

  const eventId =
    process.env.NODE_ENV === "production"
      ? prodSampleEventId
      : devSampleEventId;
  const event = await api.event.get.query({
    eventId,
  });

  const eventData = event?.event as AddToCalendarButtonProps;
  const fullImageUrl = eventData.images?.[3];

  if (!event || !eventData) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-0 max-w-7xl flex-col place-items-center sm:flex-row">
      {fullImageUrl && (
        <Image
          src={fullImageUrl}
          className="ring-dashed mx-auto h-auto max-h-80 w-auto rounded-xl object-cover shadow-sm outline-dashed outline-2 outline-offset-4 outline-gray-100"
          alt=""
          width={640}
          height={480}
        />
      )}
      <div className="flex sm:flex-row">
        {/* <Wand className="h-16 w-16 text-gray-300" /> */}
        {/* <Sparkle className="h-16 w-16" /> */}
        <ArrowBigRight className="h-16 w-16 rotate-90 sm:rotate-0" />
      </div>
      <div className="grid place-items-center rounded-xl border-2 border-gray-100 bg-white text-left shadow-md">
        <EventCard
          User={event.User}
          FollowEvent={event.FollowEvent}
          Comment={event.Comment}
          key={event.id}
          id={event.id}
          event={eventData}
          createdAt={event.createdAt}
          visibility={event.visibility}
        />
      </div>
    </div>
  );
}
