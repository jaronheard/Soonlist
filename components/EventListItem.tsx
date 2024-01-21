"use client";

import Link from "next/link";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useUser } from "@clerk/nextjs";
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
import { ConditionalWrapper } from "./ConditionalWrapper";
import { FollowEventDropdownButton } from "./FollowButtons";
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

type EventListItem = {
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

function EventDateDisplay({
  startDate,
  startTime,
  endDate,
  endTime,
  timezone,
}: {
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  timezone: string;
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
  return (
    <div className="flex shrink-0 flex-row gap-1">
      <div className="relative grid size-14 place-items-center rounded-md bg-gradient-to-b from-gray-900 to-gray-600">
        <span className="text-xs font-semibold uppercase text-white">
          {startDateInfo?.monthName.substring(0, 3)}
        </span>
        <span className="-mt-2 text-2xl font-extrabold text-white">
          {startDateInfo?.day}
        </span>
        <span className="-mt-2 text-xs font-light uppercase text-white">
          {startDateInfo?.dayOfWeek.substring(0, 3)}
        </span>
        {showNightIcon && (
          <div className="absolute -right-2 -top-2 text-2xl">🌛</div>
        )}
      </div>
      {showMultiDay && (
        <div className="grid size-14 place-items-center rounded-md bg-gradient-to-b from-gray-900 to-gray-600">
          <span className="text-xs font-semibold uppercase text-white">
            {endDateInfo?.monthName.substring(0, 3)}
          </span>
          <span className="-mt-2 text-2xl font-extrabold text-white">
            {endDateInfo?.day}
          </span>
          <span className="-mt-2 text-xs font-light uppercase text-white">
            {endDateInfo?.dayOfWeek.substring(0, 3)}
          </span>
        </div>
      )}
    </div>
  );
}

function EventDetails({
  id,
  name,
  startDate,
  startTime,
  endDate,
  endTime,
  timezone,
  location,
  singleEvent,
}: {
  id: string;
  name: string;
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
  timezone: string;
  location?: string;
  singleEvent?: boolean;
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

  if (!startDateInfo || !endDateInfo) {
    console.error("startDateInfo or endDateInfo is missing");
    return null;
  }

  return (
    <div>
      <ConditionalWrapper
        condition={!singleEvent}
        wrapper={(children) => <Link href={`/event/${id}`}>{children}</Link>}
      >
        <h3
          className={cn(
            "text-lg font-semibold leading-6 text-gray-900 sm:text-xl",
            {
              "md:line-clamp-1 line-clamp-2 md:break-all break-words":
                !singleEvent,
            }
          )}
        >
          {name}
        </h3>
      </ConditionalWrapper>
      <div className="p-1"></div>
      <div className="flex gap-2">
        {eventTimesAreDefined(startTime, endTime) && (
          <div className="shrink-0 items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {timeFormatDateInfo(startDateInfo)}-
            {timeFormatDateInfo(endDateInfo)}
          </div>
        )}
        {location && (
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${location}`}
            className={cn(
              "shrink items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
              { "line-clamp-1 break-all": !singleEvent }
            )}
          >
            📍 {location}
          </Link>
        )}
      </div>
    </div>
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
      <DropdownMenuTrigger className="ing-offset-background flex size-8 items-center justify-center rounded-md bg-primary transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <EllipsisVerticalIcon className="size-8 text-white" />
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
    <div className="flex items-center gap-2">
      <p className="whitespace-nowrap text-xs font-medium text-gray-500">
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
        <Badge className="inline-flex" variant="outline">
          <span className="line-clamp-1">&ldquo;{comment.content}&rdquo;</span>
        </Badge>
      )}
    </div>
  );
}

function SimilarEventsForSingleEvent({
  similarEvents,
}: {
  similarEvents: {
    event: EventWithUser;
    similarityDetails: SimilarityDetails;
  }[];
}) {
  return (
    <p className="whitespace-nowrap text-xs font-medium text-gray-500">
      Similar events by{" "}
      <SimilarEventsSummary similarEvents={similarEvents} singleEvent />
    </p>
  );
}

function SimilarEventsSummary({
  similarEvents,
  curatorUsername,
  singleEvent,
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
      {username !== curatorUsername && (
        <>
          {!singleEvent && ", "}
          <Link href={`${username}/events`} className="font-bold text-gray-900">
            @{username}
          </Link>
        </>
      )}
      {events.map((event) => (
        <sup key={event.id}>
          <Link href={`/event/${event.id}`} className="font-bold text-gray-900">
            *
          </Link>
        </sup>
      ))}
    </span>
  ));

  return <>{userEventLinks}</>;
}

function CuratorComment({ comment }: { comment?: Comment }) {
  return (
    <div className="flex items-center gap-2">
      {comment && (
        <Badge className="inline-flex" variant="outline">
          <span>&ldquo;{comment.content}&rdquo;</span>
        </Badge>
      )}
    </div>
  );
}

export function EventListItem(props: EventListItem) {
  const { user: clerkUser } = useUser();
  const { user, eventFollows, id, event, singleEvent, visibility } = props;
  const roles = clerkUser?.unsafeMetadata.roles as string[] | undefined;
  const isSelf = clerkUser?.id === user.id;
  const isOwner = isSelf || roles?.includes("admin");
  const isFollowing = !!eventFollows.find((item) => item.userId === user?.id);
  const comment = props.comments.findLast((item) => item.userId === user?.id);
  // always show curator if !isSelf
  const showOtherCurators = !isSelf && props.showOtherCurators;
  const showCurator = showOtherCurators || !props.hideCurator;

  return (
    <li className="relative grid px-4 py-5 sm:px-6">
      {visibility === "private" && (
        <>
          <Badge className="max-w-fit" variant="destructive">
            Unlisted Event
          </Badge>
          <div className="p-1"></div>
        </>
      )}
      <div className="flex items-center gap-4 pr-8">
        <EventDateDisplay
          startDate={event.startDate!}
          startTime={event.startTime}
          endDate={event.endDate!}
          endTime={event.endTime}
          timezone={event.timeZone || "America/Los_Angeles"}
        />
        <EventDetails
          id={id}
          name={event.name!}
          startDate={event.startDate!}
          endDate={event.endDate!}
          startTime={event.startTime!}
          endTime={event.endTime!}
          timezone={event.timeZone || "America/Los_Angeles"}
          location={event.location}
          singleEvent={singleEvent}
        />
      </div>
      <div className="p-1"></div>
      <EventDescription
        description={event.description!}
        singleEvent={singleEvent}
      />
      <div className="absolute right-4 top-5 sm:right-6">
        <EventActionButton
          user={user}
          event={event}
          id={id}
          isOwner={!!isOwner}
          isFollowing={isFollowing}
        />
      </div>
      {singleEvent && (
        <>
          <div className="p-1"></div>
          <CuratorComment comment={comment} />
        </>
      )}
      {showCurator && (
        <>
          <div className="p-1"></div>
          <EventCuratedBy
            username={user.username}
            comment={comment}
            similarEvents={props.similarEvents}
          />
        </>
      )}
      {singleEvent && props.similarEvents && props.similarEvents.length > 0 && (
        <>
          <SimilarEventsForSingleEvent similarEvents={props.similarEvents} />
        </>
      )}
    </li>
  );
}