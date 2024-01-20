"use client";

import Link from "next/link";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { SignedIn, useUser } from "@clerk/nextjs";
import { useContext } from "react";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { CalendarButton } from "./CalendarButton";
import { ShareButton } from "./ShareButton";
import { FollowEventButton, FollowEventDropdownButton } from "./FollowButtons";
import { Badge } from "./ui/badge";
import { type EventWithUser } from "./EventList";
import { type User, type EventFollow, type Comment } from "@/server/db/types";
import {
  translateToHtml,
  getDateInfoUTC,
  cn,
  showMultipleDays,
  endsNextDayBeforeMorning,
  eventTimesAreDefined,
  getDateTimeInfo,
  timeFormatDateInfo,
} from "@/lib/utils";
import { type AddToCalendarButtonPropsRestricted } from "@/types";
import { type SimilarityDetails } from "@/lib/similarEvents";
import { TimezoneContext } from "@/context/TimezoneContext";

type EventCardProps = {
  user: User;
  eventFollows: EventFollow[];
  comments: Comment[];
  id: string;
  createdAt: Date;
  event: AddToCalendarButtonPropsRestricted;
  visibility: "public" | "private";
  singleEvent?: boolean;
  hideCurator?: boolean;
  showOtherCurators?: boolean;
  similarEvents?: {
    event: EventWithUser;
    similarityDetails: SimilarityDetails;
  }[];
};

function EventDateDisplaySimple({
  startDate,
  endDate,
  startTime,
  endTime,
  timezone,
}: {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
}) {
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
  const showMultiDay = showMultipleDays(startDateInfo, endDateInfo);
  const showNightIcon =
    endsNextDayBeforeMorning(startDateInfo, endDateInfo) && !showMultiDay;
  const showTimeRange = eventTimesAreDefined(startTime, endTime);

  if (!startDateInfo || !endDateInfo) {
    console.error("startDateInfo or endDateInfo is missing");
    return null;
  }

  const formattedStartDate = `${startDateInfo.dayOfWeek.toUpperCase()}, ${startDateInfo.monthName
    .substring(0, 3)
    .toUpperCase()} ${startDateInfo.day}`;

  const formattedTimes = showTimeRange
    ? `${timeFormatDateInfo(startDateInfo)}-${timeFormatDateInfo(endDateInfo)}`
    : "";
  return (
    <span>
      {formattedStartDate} {formattedTimes}
      {showTimeRange && showNightIcon && "🌛"}
    </span>
  );
}

function EventDescription({
  description,
  singleEvent,
}: {
  description: string;
  singleEvent?: boolean;
}) {
  return (
    <div className="flex min-w-0 gap-x-4">
      <div className="min-w-0 flex-auto" suppressHydrationWarning>
        <p
          className={cn("mt-1 text-sm leading-6 text-gray-600", {
            "line-clamp-2": !singleEvent,
          })}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: translateToHtml(description),
            }}
          ></span>
        </p>
      </div>
    </div>
  );
}

function EventActionButton({
  user,
  event,
  id,
  isOwner,
  isFollowing,
}: {
  user: User;
  event: AddToCalendarButtonPropsRestricted;
  id: string;
  isOwner: boolean;
  isFollowing?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border bg-black transition-colors hover:bg-black">
        <EllipsisVerticalIcon className="h-8 w-8 text-white" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <CalendarButton
          type="dropdown"
          event={event}
          id={id}
          username={user.username}
        />
        <FollowEventDropdownButton eventId={id} following={isFollowing} />
        <ShareButton type="dropdown" event={event} id={id} />
        {isOwner && (
          <>
            <DropdownMenuSeparator />
            <EditButton userId={user.id} id={id} />
            <DropdownMenuSeparator />
            <DeleteButton userId={user.id} id={id} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EventCuratedBy({
  username,
  comment,
  similarEvents,
}: {
  username: string;
  comment?: Comment;
  similarEvents?: {
    event: EventWithUser;
    similarityDetails: SimilarityDetails;
  }[];
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-xs font-medium text-gray-500">
        Collected by{" "}
        <Link
          href={`/${username}/events`}
          className="font-bold text-gray-900"
        >{`@${username}`}</Link>
        {similarEvents && similarEvents.length > 0 && (
          <SimilarEventsSummary
            similarEvents={similarEvents}
            curatorUsername={username}
          />
        )}
      </p>
      {comment && (
        <Badge className="inline" variant="outline">
          &ldquo;{comment.content}&rdquo;
        </Badge>
      )}
    </div>
  );
}

function SimilarEventsSummary({
  similarEvents,
}: {
  similarEvents: {
    event: EventWithUser;
    similarityDetails: SimilarityDetails;
  }[];
  curatorUsername?: string;
  singleEvent?: boolean;
}) {
  // Create a map to group events by username
  const eventsByUser = new Map<string, EventWithUser[]>();

  // Iterate over similarEvents and populate the map
  similarEvents.forEach(({ event }) => {
    const userEvents = eventsByUser.get(event.user.username) || [];
    userEvents.push(event);
    eventsByUser.set(event.user.username, userEvents);
  });

  // Convert the map to an array of JSX elements
  const userEventLinks = Array.from(eventsByUser).map(([username, events]) => (
    <span key={username}>
      {/* {username !== curatorUsername && (
          <>
            {!singleEvent && ", "}
            <Link
              href={`${username}/events`}
              className="font-bold text-gray-900"
            >
              @{username}
            </Link>
          </>
        )} */}
      {events.map((event, eventIndex) => (
        <sup key={event.id}>
          <Link href={`/event/${event.id}`} className="font-bold text-gray-900">
            {eventIndex + 1}
            {events.length > 1 && eventIndex !== events.length - 1 && ", "}
          </Link>
        </sup>
      ))}
    </span>
  ));

  return <> and others {userEventLinks}</>;
}

export function EventCard(props: EventCardProps) {
  const { user: clerkUser } = useUser();
  const { user, eventFollows, id, event, singleEvent, visibility } = props;
  const roles = clerkUser?.unsafeMetadata.roles as string[] | undefined;
  const isSelf = clerkUser?.id === user.id;
  const isOwner = isSelf || roles?.includes("admin");
  const isFollowing = !!eventFollows.find(
    (item) => item.userId === clerkUser?.id
  );
  const comment = props.comments.findLast(
    (item) => item.userId === clerkUser?.id
  );

  return (
    <div className="relative mx-6 py-6">
      {visibility === "private" && (
        <>
          <Badge className="max-w-fit" variant="destructive">
            Unlisted Event
          </Badge>
        </>
      )}
      <div className="flex flex-col border-b border-gray-200 py-4">
        <div>
          <div className="text-sm font-bold uppercase text-gray-600">
            <EventDateDisplaySimple
              startDate={event.startDate}
              startTime={event.startTime}
              timezone={event.timeZone || "America/Los_Angeles"}
              endTime={event.endTime}
              endDate={event.endDate}
            />
          </div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            {event.name}
          </h1>
          {event.location && (
            <Link
              className="mt-1 max-w-2xl border-b border-gray-200 text-sm text-gray-500 hover:border-gray-900 hover:text-gray-900"
              href={`https://www.google.com/maps/search/?api=1&query=${event.location}`}
            >
              📍 {event.location}
            </Link>
          )}
          <div className="p-1"></div>
          <EventCuratedBy
            username={user.username}
            comment={comment}
            similarEvents={props.similarEvents}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <ShareButton type="button" event={event} id={id} />
          <CalendarButton
            type="button"
            event={event}
            id={id}
            username={user.username}
          />
          <FollowEventButton eventId={id} following={isFollowing} />
        </div>
      </div>
      <div className="p-1"></div>
      <EventDescription
        description={event.description!}
        singleEvent={singleEvent}
      />
      <div className="absolute right-2 top-6">
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
      </div>
    </div>
  );
}
