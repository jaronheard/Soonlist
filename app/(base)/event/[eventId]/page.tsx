import { Metadata, ResolvingMetadata } from "next/types";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { Suspense } from "react";
import { EventCard } from "@/components/EventCardNew";
import { UserInfo } from "@/components/UserInfo";
import { AddToCalendarButtonProps } from "@/types";
import { collapseSimilarEvents } from "@/lib/similarEvents";
import EventList, { EventWithUser } from "@/components/EventList";
import { api } from "@/trpc/server";
import NextEventsLoading from "@/components/NextEventsLoading";

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

async function MoreEventsFromUser({
  eventId,
  userId,
  username,
}: {
  eventId: string;
  userId: string;
  username: string;
}) {
  const otherEvents = await api.event.getCreatedForUser.query({
    userName: username,
  });
  const futureEvents = otherEvents
    .filter((item) => item.startDateTime >= new Date())
    .filter((item) => item.id !== eventId)
    .slice(0, 3);

  return (
    <>
      <div className="mr-auto flex place-items-center gap-2.5 px-6">
        <div className="font-medium">More events from</div>
        <UserInfo userId={userId} />
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

function MoreEventsFromUserLoading({ userId }: { userId: string }) {
  return (
    <>
      <div className="mr-auto flex place-items-center gap-2.5 px-6">
        <div className="font-medium">More events from</div>
        <UserInfo userId={userId} />
      </div>
      <div className="p-2"></div>
      <NextEventsLoading />
    </>
  );
}

export default async function Page({ params }: Props) {
  const event = await api.event.get.query({ eventId: params.eventId });

  if (!event) {
    return <p className="text-lg text-gray-500">No event found.</p>;
  }

  const eventData = event?.event as AddToCalendarButtonProps;
  const fullImageUrl = eventData?.images?.[3];

  return (
    <>
      <EventCard
        User={event.User}
        FollowEvent={event.FollowEvent}
        Comment={event.Comment}
        key={event.id}
        id={event.id}
        event={event.event as AddToCalendarButtonProps}
        createdAt={event.createdAt}
        visibility={event.visibility}
        startDateTime={event.startDateTime}
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
      <Suspense fallback={<MoreEventsFromUserLoading userId={event.User.id} />}>
        <MoreEventsFromUser
          eventId={event.id}
          username={event.User.username}
          userId={event.User.id}
        />
      </Suspense>
    </>
  );
}
