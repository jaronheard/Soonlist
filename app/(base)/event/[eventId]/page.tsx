import { type Metadata, type ResolvingMetadata } from "next/types";
import Image from "next/image";
import { EventCard } from "@/components/EventCardNew";
import { UserInfo } from "@/components/UserInfo";
import { type AddToCalendarButtonProps } from "@/types";
import { collapseSimilarEvents } from "@/lib/similarEvents";
import EventList, { type EventWithUser } from "@/components/EventList";
import { api } from "@/trpc/server";

type Props = {
  params: {
    eventId: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const event = await api.event.get.query({ eventId: params.eventId });
  if (!event) {
    return {
      title: "No event found | Soonlist",
      openGraph: {
        images: [],
      },
    };
  }

  const eventData = event.event as AddToCalendarButtonProps;
  // optionally access and extend (rather than replace) parent metadata
  // images are in the order of square, 4:3, 16:9, cropped
  const hasAllImages = eventData.images && eventData.images.length === 4;
  const previewImage = hasAllImages ? eventData.images?.slice(2, 3) : undefined;

  return {
    title: `${eventData.name} | Soonlist`,
    openGraph: {
      title: `${eventData.name}`,
      description: `(${eventData.startDate} ${eventData.startTime}-${eventData.endTime}) ${eventData.description}`,
      url: `${process.env.NEXT_PUBLIC_URL}/event/${event.id}`,
      type: "article",
      images: previewImage || (await parent).openGraph?.images || [],
    },
  };
}

export default async function Page({ params }: Props) {
  const event = await api.event.get.query({ eventId: params.eventId });
  if (!event) {
    return <p className="text-lg text-gray-500">No event found.</p>;
  }
  const otherEvents = await api.event.getCreatedForUser.query({
    userName: event.user.username,
  });

  const futureEvents = otherEvents
    .filter((item) => item.startDateTime >= new Date())
    .filter((item) => item.id !== event.id)
    .slice(0, 3);

  const eventData = event?.event as AddToCalendarButtonProps;
  const fullImageUrl = eventData.images?.[3];

  const possibleDuplicateEvents = (await api.event.getPossibleDuplicates.query({
    startDateTime: event.startDateTime,
  })) as EventWithUser[];

  // find the event that matches the current event
  const similarEvents = collapseSimilarEvents(possibleDuplicateEvents).find(
    (similarEvent) => similarEvent.event.id === event.id
  )?.similarEvents;

  return (
    <>
      <EventCard
        user={event.user}
        eventFollows={event.eventFollows}
        comments={event.comments}
        key={event.id}
        id={event.id}
        event={event.event as AddToCalendarButtonProps}
        createdAt={event.createdAt}
        visibility={event.visibility}
        similarEvents={similarEvents}
        singleEvent
        hideCurator
      />
      {fullImageUrl && (
        <>
          <Image
            src={fullImageUrl}
            className="mx-auto h-auto w-2/3 object-cover sm:w-1/3"
            alt=""
            width={640}
            height={480}
          />
        </>
      )}
      <div className="p-12 sm:p-16"></div>
      <div className="mr-auto flex place-items-center gap-2.5 px-6">
        <div className="font-medium">More events from</div>
        <UserInfo userId={event.userId} />
      </div>
      <div className="p-2"></div>
      <EventList
        currentEvents={[]}
        pastEvents={[]}
        futureEvents={futureEvents}
        hideCurator
        variant="future-minimal"
        showOtherCurators={true}
      ></EventList>
    </>
  );
}
