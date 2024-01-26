import { clsx } from "clsx";
import {
  type User,
  type EventFollow,
  type Event,
  type Comment,
} from "@/server/db/types";
import { EventListItem } from "@/components/EventListItem";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordian";
import { type AddToCalendarButtonPropsRestricted } from "@/types";
import { collapseSimilarEvents } from "@/lib/similarEvents";
import { cn } from "@/lib/utils";

export type EventWithUser = Event & {
  user: User;
  eventFollows: EventFollow[];
  comments: Comment[];
};

export default function EventList({
  currentEvents,
  futureEvents,
  pastEvents,
  variant,
  hideCurator,
  showOtherCurators,
  showPrivateEvents,
}: {
  currentEvents: EventWithUser[];
  futureEvents: EventWithUser[];
  pastEvents: EventWithUser[];
  variant?: "future-minimal";
  showOtherCurators?: boolean;
  hideCurator?: boolean;
  showPrivateEvents?: boolean;
  children?: React.ReactNode;
}) {
  function getVisibleEvents(events: EventWithUser[]) {
    return events.filter(
      (item) => showPrivateEvents || item.visibility === "public"
    );
  }

  const currentEventsToUse = collapseSimilarEvents(
    getVisibleEvents(currentEvents)
  );
  const pastEventsToUse = collapseSimilarEvents(getVisibleEvents(pastEvents));
  const futureEventsToUse = collapseSimilarEvents(
    getVisibleEvents(futureEvents)
  );
  const showPastEvents = variant !== "future-minimal";
  const showCurrentEvents = true;

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["current-events", "future-events"]}
    >
      {showPastEvents && (
        <AccordionItem value="past-events" className={clsx("px-6 opacity-80")}>
          <AccordionTrigger>
            <div className="flex w-full items-center justify-between">
              Past events
              <span className="inline-flex items-center justify-center rounded-full bg-interactive-1 px-2 py-1 text-lg font-semibold leading-none text-white">
                {pastEventsToUse.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="-mx-6">
            {pastEventsToUse.length === 0 ? (
              <p className="mx-6 text-lg text-gray-500">No past events.</p>
            ) : (
              <ul role="list" className="flex max-w-full flex-col gap-4">
                {pastEventsToUse.map(({ event: item, similarEvents }) => (
                  <EventListItem
                    key={item.id}
                    user={item.user}
                    eventFollows={item.eventFollows}
                    comments={item.comments}
                    id={item.id}
                    event={item.event as AddToCalendarButtonPropsRestricted}
                    visibility={item.visibility}
                    createdAt={item.createdAt}
                    hideCurator={hideCurator}
                    showOtherCurators={showOtherCurators}
                    similarEvents={similarEvents}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
      {showCurrentEvents && currentEventsToUse.length > 0 && (
        <AccordionItem value="current-events" className="px-6">
          <AccordionTrigger className="-mx-6 px-6">
            <div className="flex w-full items-center justify-between">
              Happening now
              <span className="inline-flex items-center justify-center rounded-full bg-interactive-1 px-2 py-1 text-lg font-semibold leading-none text-white">
                {currentEventsToUse.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="-mx-6 rounded-xl">
            {currentEventsToUse.length === 0 ? (
              <p className="mx-6 text-lg text-gray-500">No future events.</p>
            ) : (
              <ul
                role="list"
                className="flex max-w-full flex-col gap-4 rounded-xl"
              >
                {currentEventsToUse.map(({ event: item, similarEvents }) => (
                  <EventListItem
                    key={item.id}
                    user={item.user}
                    eventFollows={item.eventFollows}
                    comments={item.comments}
                    id={item.id}
                    event={item.event as AddToCalendarButtonPropsRestricted}
                    visibility={item.visibility}
                    createdAt={item.createdAt}
                    hideCurator={hideCurator}
                    showOtherCurators={showOtherCurators}
                    similarEvents={similarEvents}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
      <AccordionItem
        value="future-events"
        className={clsx("px-6")}
        disabled={variant === "future-minimal"}
      >
        {variant !== "future-minimal" && (
          <AccordionTrigger
            className={cn({
              "hover:no-underline": variant === "future-minimal",
            })}
          >
            <div className="flex w-full items-center justify-between">
              Upcoming events
              <span className="inline-flex items-center justify-center rounded-full bg-interactive-1 px-2 py-1 text-lg font-semibold leading-none text-white">
                {futureEventsToUse.length}
              </span>
            </div>
          </AccordionTrigger>
        )}
        <AccordionContent className="-mx-6 rounded-xl">
          {futureEventsToUse.length === 0 ? (
            <p className="mx-6 text-lg text-gray-500">No future events.</p>
          ) : (
            <ul role="list" className="flex max-w-full flex-col gap-4">
              {futureEventsToUse.map(({ event: item, similarEvents }) => (
                <EventListItem
                  key={item.id}
                  user={item.user}
                  eventFollows={item.eventFollows}
                  comments={item.comments}
                  id={item.id}
                  event={item.event as AddToCalendarButtonPropsRestricted}
                  visibility={item.visibility}
                  createdAt={item.createdAt}
                  hideCurator={hideCurator}
                  showOtherCurators={showOtherCurators}
                  similarEvents={similarEvents}
                />
              ))}
            </ul>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
