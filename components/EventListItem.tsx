"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useContext } from "react";
import { ArrowRight } from "lucide-react";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { CalendarButton } from "./CalendarButton";
import { ShareButton } from "./ShareButton";
import { type EventWithUser } from "./EventList";
import { buttonVariants } from "./ui/button";
import { type User, type EventFollow, type Comment } from "@/server/db/types";
import {
  translateToHtml,
  getDateInfoUTC,
  cn,
  showMultipleDays,
  // endsNextDayBeforeMorning,
  eventTimesAreDefined,
  getDateTimeInfo,
  timeFormatDateInfo,
} from "@/lib/utils";
import { type AddToCalendarButtonPropsRestricted } from "@/types";
import { type SimilarityDetails } from "@/lib/similarEvents";
import { TimezoneContext } from "@/context/TimezoneContext";

type EventListItemProps = {
  user: User;
  eventFollows: EventFollow[];
  comments: Comment[];
  id: string;
  createdAt: Date;
  event: AddToCalendarButtonPropsRestricted;
  visibility: "public" | "private";
  hideCurator?: boolean;
  showOtherCurators?: boolean;
  similarEvents?: {
    event: EventWithUser;
    similarityDetails: SimilarityDetails;
  }[];
};

function EventDateDisplaySimple({
  startDate,
  startTime,
  endDate,
  endTime,
  timezone,
}: {
  startDate?: string;
  startTime?: string;
  endDate?: string;
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
  // const showNightIcon =
  //   endsNextDayBeforeMorning(startDateInfo, endDateInfo) && !showMultiDay;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="text-lg font-semibold uppercase leading-none text-neutral-2">
        {startDateInfo?.monthName.substring(0, 3)}
      </div>
      <div className="font-heading text-4xl font-bold leading-none tracking-tighter text-neutral-1">
        {startDateInfo?.day}
      </div>
    </div>
  );
}

function EventDetails({
  id,
  name,
  image,
  startDate,
  startTime,
  endDate,
  endTime,
  timezone,
  location,
  description,
  EventActionButtons,
}: {
  id: string;
  name: string;
  image?: string;
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
  timezone: string;
  description?: string;
  location?: string;
  EventActionButtons?: React.ReactNode;
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

  if (!description) {
    description = "";
  }

  return (
    <div className="flex flex-col items-start justify-center gap-2">
      {/* duplicated with Event */}
      <div className="flex-start flex gap-2 pr-12 text-lg font-medium leading-none">
        {eventTimesAreDefined(startTime, endTime) && (
          <>
            <div className="flex-wrap text-neutral-2">
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
      {/* end duplicated with Event */}
      <div className="flex flex-col items-start gap-2">
        <Link
          href={`/event/${id}`}
          className={
            "line-clamp-2 pr-12 text-2.5xl font-bold leading-9 tracking-[0.56px] text-neutral-1"
          }
        >
          {name}
        </Link>
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
        <div className="pt-2">
          <EventDescription description={description} />
        </div>
        <Link
          href={`/event/${id}`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "group h-full p-0"
          )}
        >
          Learn more <ArrowRight className="ml-1 size-4 text-interactive-2 " />
        </Link>
        <div className="place-self-end">
          {EventActionButtons && <>{EventActionButtons}</>}
        </div>
      </div>
    </div>
  );
}

function EventDescription({
  description,
}: {
  description: string;
  singleEvent?: boolean;
}) {
  return (
    <p className={"line-clamp-3 text-lg leading-7 text-neutral-1"}>
      <span
        dangerouslySetInnerHTML={{
          __html: translateToHtml(description),
        }}
      ></span>
    </p>
  );
}

function EventActionButtons({
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
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-4">
        <div className="text-lg font-medium leading-none text-neutral-2">
          added by @{user.username}
        </div>
        <Link
          href={`/${user.username}/events`}
          className="box-content block size-[2.625rem] shrink-0 rounded-full border-4 border-accent-yellow"
        >
          <Image
            className="rounded-full"
            src={user.userImage}
            alt=""
            width={375}
            height={375}
          />
        </Link>
      </div>
      <CalendarButton
        type="icon"
        event={event}
        id={id}
        username={user.username}
      />
      {/* <FollowEventDropdownButton eventId={id} following={isFollowing} /> */}
      <ShareButton type="icon" event={event} id={id} />
      {isOwner && (
        <>
          <EditButton type="icon" userId={user.id} id={id} />
          <DeleteButton type="icon" userId={user.id} id={id} />
        </>
      )}
    </div>
  );
}

export function EventListItem(props: EventListItemProps) {
  const { user: clerkUser } = useUser();
  const { user, eventFollows, id, event } = props;
  const roles = clerkUser?.unsafeMetadata.roles as string[] | undefined;
  const isSelf = clerkUser?.id === user.id;
  const isOwner = isSelf || roles?.includes("admin");
  const isFollowing = !!eventFollows.find((item) => item.userId === user?.id);
  const image = event.images?.[3];
  // const comment = props.comments.findLast((item) => item.userId === user?.id);
  // always show curator if !isSelf
  // const showOtherCurators = !isSelf && props.showOtherCurators;
  // const showCurator = showOtherCurators || !props.hideCurator;

  return (
    <div className="relative">
      {image && (
        <Link href={`/event/${id}`}>
          <Image
            className="absolute left-0 top-7 z-10 hidden size-20 -translate-x-1/2 rounded-xl lg:block"
            src={image}
            alt=""
            width={375}
            height={375}
          />
        </Link>
      )}
      <li className="relative grid overflow-hidden rounded-xl bg-white p-7 shadow-sm after:pointer-events-none after:absolute after:left-0 after:top-0 after:size-full after:rounded-xl after:border after:border-neutral-3 after:shadow-sm lg:pl-16">
        {/* {visibility === "private" && (
        <>
          <Badge className="max-w-fit" variant="destructive">
            Unlisted Event
          </Badge>
          <div className="p-1"></div>
        </>
      )} */}
        <div className="absolute -right-24 -top-20 size-44 overflow-hidden rounded-full bg-interactive-3"></div>
        <div className="absolute right-0 top-0 p-3">
          <EventDateDisplaySimple
            startDate={event.startDate}
            startTime={event.startTime}
            endDate={event.endDate}
            endTime={event.endTime}
            timezone={event.timeZone || "America/Los_Angeles"}
          />
        </div>
        <div className="flex items-start gap-7">
          <EventDetails
            id={id}
            name={event.name!}
            image={image}
            startDate={event.startDate!}
            endDate={event.endDate!}
            startTime={event.startTime!}
            endTime={event.endTime!}
            timezone={event.timeZone || "America/Los_Angeles"}
            location={event.location}
            description={event.description}
            EventActionButtons={
              <EventActionButtons
                user={user}
                event={event}
                id={id}
                isOwner={!!isOwner}
                isFollowing={isFollowing}
              />
            }
          />
        </div>
      </li>
    </div>
  );
}
