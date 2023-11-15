import { Comment, Event, FollowEvent, User } from "@prisma/client";
import { clsx } from "clsx";
import RainbowText from "./RainbowText";
import { EventCard } from "@/components/EventCard";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordian";
import { AddToCalendarButtonProps } from "@/types";
import { isEventSimilar } from "@/lib/similarEvents";

type EventWithUser = Event & {
  User: User;
  FollowEvent: FollowEvent[];
  Comment: Comment[];
};

export default function EventList({
  currentEvents,
  futureEvents,
  pastEvents,
  variant,
  hideCurator,
  showPrivateEvents,
}: {
  currentEvents: EventWithUser[];
  futureEvents: EventWithUser[];
  pastEvents: EventWithUser[];
  variant?: "future-minimal";
  hideCurator?: boolean;
  showPrivateEvents?: boolean;
}) {
  const publicCurrentEvents = currentEvents.filter(
    (item) => item.visibility === "public"
  );
  const publicFutureEvents = futureEvents.filter(
    (item) => item.visibility === "public"
  );
  const publicPastEvents = pastEvents.filter(
    (item) => item.visibility === "public"
  );
  const currentEventsToShow = showPrivateEvents
    ? currentEvents
    : publicCurrentEvents;
  const futureEventsToShow = showPrivateEvents
    ? futureEvents
    : publicFutureEvents;
  const pastEventsToShow = showPrivateEvents ? pastEvents : publicPastEvents;
  const showPastEvents = variant !== "future-minimal";
  const showCurrentEvents = true;

  // Define thresholds
  const startTimeThreshold = 60; // 60 minutes for start time
  const endTimeThreshold = 60; // 60 minutes for end time
  const nameThreshold = 0.1; // 70% similarity for name
  const descriptionThreshold = 0.1; // 70% similarity for description
  const locationThreshold = 0.1; // 70% similarity for location

  // Structure to store similarity info
  type EventWithSimilarity = {
    event: EventWithUser;
    similarEvents: {
      event: EventWithUser;
      similarityDetails: ReturnType<typeof isEventSimilar>;
    }[];
  };

  const futureEventsToShowWithSimilarity: EventWithSimilarity[] = [];

  futureEventsToShow.forEach((event, index) => {
    const similarityData: EventWithSimilarity["similarEvents"] = [];

    futureEventsToShow.forEach((otherEvent, otherIndex) => {
      if (index !== otherIndex) {
        // Avoid comparing an event with itself
        const similarityDetails = isEventSimilar(
          event,
          otherEvent,
          startTimeThreshold,
          endTimeThreshold,
          nameThreshold,
          descriptionThreshold,
          locationThreshold
        );

        if (similarityDetails.isSimilar) {
          similarityData.push({ event: otherEvent, similarityDetails });
        }
      }
    });

    futureEventsToShowWithSimilarity.push({
      event,
      similarEvents: similarityData,
    });
  });

  const filteredEventsToShow: EventWithSimilarity[] = [];

  // Create a Set to track events that have already been considered
  const seenEvents = new Set();

  futureEventsToShowWithSimilarity.forEach((item) => {
    const { event: currentEvent, similarEvents } = item;
    if (seenEvents.has(currentEvent.id)) {
      // Skip this event if it has already been seen
      return;
    }

    let earliestEvent = currentEvent;
    let earliestCreationDate = new Date(currentEvent.createdAt);

    similarEvents.forEach(({ event: similarEvent }) => {
      const similarEventCreationDate = new Date(similarEvent.createdAt);

      if (similarEventCreationDate < earliestCreationDate) {
        earliestEvent = similarEvent;
        earliestCreationDate = similarEventCreationDate;
      }

      // Mark this similar event as seen
      seenEvents.add(similarEvent.id);
    });

    // Add the earliest event to the filtered list
    filteredEventsToShow.push({ event: earliestEvent, similarEvents });
  });

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["current-events", "future-events"]}
    >
      {showPastEvents && (
        <AccordionItem
          value="past-events"
          className={clsx("px-6 opacity-80", {
            "border-b-0": currentEventsToShow.length > 0,
          })}
        >
          <AccordionTrigger>
            <div className="flex gap-1.5">
              Past events
              <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
                {pastEventsToShow.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="-mx-6">
            {pastEventsToShow.length === 0 ? (
              <p className="mx-6 text-lg text-gray-500">No past events.</p>
            ) : (
              <ul role="list" className="max-w-full divide-y divide-gray-100">
                {pastEventsToShow.map((item) => (
                  <EventCard
                    key={item.id}
                    User={item.User}
                    FollowEvent={item.FollowEvent}
                    Comment={item.Comment}
                    id={item.id}
                    event={item.event as AddToCalendarButtonProps}
                    visibility={item.visibility}
                    createdAt={item.createdAt}
                    hideCurator={hideCurator}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
      {showCurrentEvents && currentEventsToShow.length > 0 && (
        <AccordionItem
          value="current-events"
          className="relative border-b-0 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-purple-500/10 px-6 ring-1 ring-black/10 sm:rounded-2xl"
        >
          <AccordionTrigger>
            <div className="flex gap-1.5 font-semibold">
              Happening now
              <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
                {currentEventsToShow.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="-mx-6 rounded-xl">
            {currentEventsToShow.length === 0 ? (
              <p className="mx-6 text-lg text-gray-500">No future events.</p>
            ) : (
              <ul
                role="list"
                className="max-w-full divide-y divide-gray-100 rounded-xl"
              >
                {currentEventsToShow.map((item) => (
                  <EventCard
                    key={item.id}
                    User={item.User}
                    FollowEvent={item.FollowEvent}
                    Comment={item.Comment}
                    id={item.id}
                    event={item.event as AddToCalendarButtonProps}
                    visibility={item.visibility}
                    createdAt={item.createdAt}
                    hideCurator={hideCurator}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
      <AccordionItem
        value="future-events"
        className={clsx("px-6", {
          "border-b-0": futureEventsToShow.length > 0,
        })}
      >
        <AccordionTrigger>
          <div className="flex gap-1.5">
            {variant === "future-minimal"
              ? "Portland area events happening soon"
              : "Upcoming events"}
            <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
              {futureEventsToShow.length}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="-mx-6 rounded-xl">
          {futureEventsToShow.length === 0 ? (
            <p className="mx-6 text-lg text-gray-500">No future events.</p>
          ) : (
            <ul
              role="list"
              className="max-w-full divide-y divide-gray-100 rounded-xl"
            >
              {filteredEventsToShow.map(({ event: item, similarEvents }) => (
                <div key={item.id}>
                  <EventCard
                    key={item.id}
                    User={item.User}
                    FollowEvent={item.FollowEvent}
                    Comment={item.Comment}
                    id={item.id}
                    event={item.event as AddToCalendarButtonProps}
                    visibility={item.visibility}
                    createdAt={item.createdAt}
                    hideCurator={hideCurator}
                  />
                  {/* Similar Events Section */}
                  {similarEvents.length > 0 && (
                    <div className="ml-4 mt-2">
                      <p className="text-md font-semibold">Similar Events:</p>
                      <ul>
                        {similarEvents.map(
                          ({ event: similarEvent, similarityDetails }) => {
                            const similarEventData =
                              similarEvent.event as AddToCalendarButtonProps;
                            return (
                              <li
                                key={similarEvent.id}
                                className="mt-1 text-sm text-gray-600"
                              >
                                {similarEventData.name} - Name Similarity:{" "}
                                {similarityDetails.nameSimilarity.toFixed(2)},
                                Description Similarity:{" "}
                                {similarityDetails.descriptionSimilarity.toFixed(
                                  2
                                )}
                                , Location Similarity:{" "}
                                {similarityDetails.locationSimilarity.toFixed(
                                  2
                                )}
                                {/* You can add more details or style it as per your design */}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                  )}{" "}
                </div>
              ))}
            </ul>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
