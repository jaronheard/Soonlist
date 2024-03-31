"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useContext, useEffect, useState } from "react";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { CalendarButton } from "./CalendarButton";
import { ShareButton } from "./ShareButton";
import { FollowEventButton } from "./FollowButtons";
import { type EventWithUser } from "./EventList";
import ListCard from "./ListCard";
import PersonalNote from "./PersonalNote";
import UserAllEventsCard from "./UserAllEventsCard";
import {
  type User,
  type EventFollow,
  type Comment,
  type List,
} from "@/server/db/types";
import {
  translateToHtml,
  getDateInfoUTC,
  eventTimesAreDefined,
  getDateTimeInfo,
  timeFormatDateInfo,
} from "@/lib/utils";
import { type AddToCalendarButtonPropsRestricted } from "@/types";
import { type SimilarityDetails } from "@/lib/similarEvents";
import { TimezoneContext } from "@/context/TimezoneContext";

type EventProps = {
  user?: User;
  eventFollows: EventFollow[];
  comments: Comment[];
  id: string;
  createdAt?: Date;
  event: AddToCalendarButtonPropsRestricted;
  image?: string;
  visibility: "public" | "private";
  singleEvent?: boolean;
  hideCurator?: boolean;
  showOtherCurators?: boolean;
  similarEvents?: {
    event: EventWithUser;
    similarityDetails: SimilarityDetails;
  }[];
  lists?: List[];
  children?: React.ReactNode;
};

function EventDescription({
  description,
}: {
  description: string;
  singleEvent?: boolean;
}) {
  return (
    <div className={"text-lg leading-7 text-neutral-1"}>
      <span
        dangerouslySetInnerHTML={{
          __html: translateToHtml(description),
        }}
      ></span>
    </div>
  );
}

// function EventActionButton({
//   user,
//   event,
//   id,
//   isOwner,
//   isFollowing,
// }: {
//   user: User;
//   event: AddToCalendarButtonPropsRestricted;
//   id: string;
//   isOwner: boolean;
//   isFollowing?: boolean;
// }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md border bg-black transition-colors hover:bg-black">
//         <EllipsisVerticalIcon className="size-8 text-white" />
//         <span className="sr-only">Open</span>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <CalendarButton
//           type="dropdown"
//           event={event}
//           id={id}
//           username={user.username}
//         />
//         <FollowEventDropdownButton eventId={id} following={isFollowing} />
//         <ShareButton type="dropdown" event={event} id={id} />
//         {isOwner && (
//           <>
//             <DropdownMenuSeparator />
//             <EditButton type="dropdown" userId={user.id} id={id} />
//             <DropdownMenuSeparator />
//             <DeleteButton type="dropdown" userId={user.id} id={id} />
//           </>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// function EventCuratedBy({
//   username,
//   comment,
//   similarEvents,
// }: {
//   username: string;
//   comment?: Comment;
//   similarEvents?: {
//     event: EventWithUser;
//     similarityDetails: SimilarityDetails;
//   }[];
// }) {
//   return (
//     <div className="flex flex-col items-start gap-2">
//       <p className="text-xs font-medium text-gray-500">
//         Collected by{" "}
//         <Link
//           href={`/${username}/events`}
//           className="font-bold text-gray-900"
//         >{`@${username}`}</Link>
//         {similarEvents && similarEvents.length > 0 && (
//           <SimilarEventsSummary
//             similarEvents={similarEvents}
//             curatorUsername={username}
//           />
//         )}
//       </p>
//       {comment && (
//         <Badge className="inline" variant="outline">
//           &ldquo;{comment.content}&rdquo;
//         </Badge>
//       )}
//     </div>
//   );
// }

// function SimilarEventsSummary({
//   similarEvents,
// }: {
//   similarEvents: {
//     event: EventWithUser;
//     similarityDetails: SimilarityDetails;
//   }[];
//   curatorUsername?: string;
//   singleEvent?: boolean;
// }) {
//   // Create a map to group events by username
//   const eventsByUser = new Map<string, EventWithUser[]>();

//   // Iterate over similarEvents and populate the map
//   similarEvents.forEach(({ event }) => {
//     const userEvents = eventsByUser.get(event.user.username) || [];
//     userEvents.push(event);
//     eventsByUser.set(event.user.username, userEvents);
//   });

//   // Convert the map to an array of JSX elements
//   const userEventLinks = Array.from(eventsByUser).map(([username, events]) => (
//     <span key={username}>
//       {/* {username !== curatorUsername && (
//           <>
//             {!singleEvent && ", "}
//             <Link
//               href={`${username}/events`}
//               className="font-bold text-gray-900"
//             >
//               @{username}
//             </Link>
//           </>
//         )} */}
//       {events.map((event, eventIndex) => (
//         <sup key={event.id}>
//           <Link href={`/event/${event.id}`} className="font-bold text-gray-900">
//             {eventIndex + 1}
//             {events.length > 1 && eventIndex !== events.length - 1 && ", "}
//           </Link>
//         </sup>
//       ))}
//     </span>
//   ));

//   return <> and others {userEventLinks}</>;
// }

export function Event(props: EventProps) {
  const { user: clerkUser } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { user, eventFollows, id, event, image, singleEvent, children, lists } =
    props;
  const roles = clerkUser?.unsafeMetadata.roles as string[] | undefined;
  const isSelf =
    clerkUser?.id === user?.id || clerkUser?.externalId === user?.id;
  const isOwner = isSelf || roles?.includes("admin");
  const isFollowing = !!eventFollows.find(
    (item) =>
      clerkUser?.id === item.userId || clerkUser?.externalId === item.userId
  );
  const comment = props.comments?.findLast((item) => user?.id === item.userId);
  const hasLists = user && lists && lists.length > 0;

  const {
    startDate,
    startTime,
    endDate,
    endTime,
    timeZone: timezone,
    location,
  } = event;

  const { timezone: userTimezone } = useContext(TimezoneContext);
  if (!startDate || !endDate) {
    console.error("startDate or endDate is missing");
    return null;
  }

  if (!timezone) {
    console.error("timezone is missing");
    return null;
  }

  const startDateInfo = startTime
    ? getDateTimeInfo(startDate, startTime, timezone, userTimezone.toString())
    : getDateInfoUTC(startDate);
  const endDateInfo = endTime
    ? getDateTimeInfo(endDate, endTime, timezone, userTimezone.toString())
    : getDateInfoUTC(endDate);

  if (!startDateInfo || !endDateInfo) {
    console.error("startDateInfo or endDateInfo is missing");
    return null;
  }

  return (
    <div className="">
      {/* {visibility === "private" && (
        <>
          <Badge className="max-w-fit" variant="destructive">
            Unlisted Event
          </Badge>
        </>
      )} */}
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <div className="flex flex-col gap-5">
            {/* duplicated with EventListItem */}
            <div className="flex-start flex gap-2 pr-12 text-lg font-medium leading-none">
              {isClient && eventTimesAreDefined(startTime, endTime) && (
                <>
                  <div className="shrink-0 text-neutral-2">
                    {startDateInfo?.dayOfWeek.substring(0, 3)}
                    {", "}
                    {startDateInfo?.month}/{startDateInfo?.day}/
                    {startDateInfo?.year.toString().substring(2, 4)}{" "}
                    <span className="text-neutral-3">{"//"}</span>{" "}
                    {timeFormatDateInfo(startDateInfo)}-
                    {timeFormatDateInfo(endDateInfo)}
                  </div>
                </>
              )}
            </div>
            {/* end duplicated with EventListItem */}
            <h1 className="font-heading text-5xl font-bold leading-[3.5rem]">
              {event.name}
            </h1>
            <div className="flex-start flex gap-2 pr-12 text-lg font-medium leading-none">
              {location && (
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${location}`}
                  className={"line-clamp-1 shrink break-all text-neutral-2"}
                >
                  {location}
                </Link>
              )}
            </div>
            <PersonalNote text={comment?.content} />
            {!hasLists && user && (
              <UserAllEventsCard
                username={user.username}
                userImage={user.userImage}
              ></UserAllEventsCard>
            )}
            {hasLists &&
              lists.map((list) => (
                <ListCard
                  key={list.id}
                  name={list.name}
                  username={user?.username}
                  id={list.id}
                />
              ))}
          </div>
          <div className="flex flex-col gap-8 pt-8">
            <EventDescription
              description={event.description!}
              singleEvent={singleEvent}
            />
            {!children && (
              <div className="flex flex-wrap gap-2">
                <ShareButton type="button" event={event} id={id} />
                <CalendarButton
                  type="button"
                  event={event}
                  id={id}
                  username={user?.username}
                />

                {user && !isSelf && (
                  <FollowEventButton eventId={id} following={isFollowing} />
                )}
                {user && isOwner && (
                  <EditButton type="icon" userId={user.id} id={id} />
                )}
                {user && isOwner && (
                  <DeleteButton type="icon" userId={user.id} id={id} />
                )}
              </div>
            )}
          </div>
        </div>
        {image && (
          <Image
            src={image}
            className="mx-auto h-auto max-h-96 w-full object-contain"
            alt=""
            width={640}
            height={480}
          />
        )}
        {children}
      </div>
      {/* <div className="absolute right-2 top-6">
        {isOwner && (
          <SignedIn>
            <EventActionButton
              user={user}
              event={event}
              id={id}
              isOwner={!!isOwner}
              isFollowing={isFollowing}
            />
          </SignedIn>
        )}
      </div> */}
    </div>
  );
}
