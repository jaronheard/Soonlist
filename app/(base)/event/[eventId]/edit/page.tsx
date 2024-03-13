import { UserInfo } from "@/components/UserInfo";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import { type AddToCalendarButtonProps } from "@/types";
import ImageUpload from "@/app/(base)/new/ImageUpload";
import { YourDetails } from "@/app/(base)/new/YourDetails";
import { api } from "@/trpc/server";

export default async function Page({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await api.event.get.query({ eventId: params.eventId });

  if (!event) {
    return <p className="text-lg text-gray-500">No event found.</p>;
  }

  const eventData = event.event as AddToCalendarButtonProps;
  const mostRecentComment = event.comments.findLast(
    (comment) => comment.content
  )?.content;
  return (
    <>
      {event?.event ? (
        <>
          <YourDetails
            lists={event.user.lists || undefined}
            eventLists={[]} // TODO: get event lists
            comment={mostRecentComment}
            visibility={event.visibility}
          />
          <div className="p-4"></div>
          <ImageUpload images={eventData.images as string[]} />
          <div className="p-4"></div>
          <AddToCalendarCard
            {...eventData}
            key={event.id}
            update
            updateId={params.eventId}
          />
        </>
      ) : (
        <p className="text-lg text-gray-500">No event found.</p>
      )}
      <div className="p-4"></div>
      <div className="flex place-items-center gap-2">
        <div className="font-medium">Collected by</div>
        <UserInfo userId={event.userId} />
      </div>
    </>
  );
}
