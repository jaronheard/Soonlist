import { EventListItem } from "./EventListItem";
import { api } from "@/trpc/server";
import { type AddToCalendarButtonPropsRestricted } from "@/types";

export default async function SampleEvent({ eventId }: { eventId: string }) {
  const event = await api.event.get.query({
    eventId,
  });

  const eventData = event?.event as AddToCalendarButtonPropsRestricted;
  // const fullImageUrl = eventData?.images?.[3];

  if (!event || !eventData) {
    return null;
  }

  return (
    <EventListItem
      user={event.user}
      eventFollows={event.eventFollows}
      comments={event.comments}
      key={event.id}
      id={event.id}
      event={eventData}
      createdAt={event.createdAt}
      visibility={event.visibility}
    />
  );
}
