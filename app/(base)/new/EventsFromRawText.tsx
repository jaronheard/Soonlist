import { OpenAI } from "openai";
import EventsError from "./EventsError";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import { type AddToCalendarButtonProps } from "@/types";
import { getPrompt, getSystemMessage } from "@/lib/prompts";

// parse the response text into array of events. response format is:
interface Response {
  events: Event[]; // An array of events.
}

interface Event {
  name: string; // The event's name.
  description: string; // Short description of the event, its significance, and what attendees can expect.
  startDate: string; // Start date in YYYY-MM-DD format.
  startTime?: string; // Start time, if applicable (omit for all-day events).
  endDate: string; // End date in YYYY-MM-DD format.
  endTime?: string; // End time, if applicable (omit for all-day events).
  timeZone: string; // Timezone in IANA format.
  location: string; // Location of the event.
}

export const extractJsonFromResponse = (response: string) => {
  console.log("response", response);
  // OpenAI returns a JSON code block starting with ```json and ending with ```
  const start = response.indexOf("```json");
  const end = response.lastIndexOf("```");
  if (start === -1 || end === -1) {
    return null;
  }
  const jsonString = response.slice(start + 7, end);
  return JSON.parse(jsonString) as Response;
};

const blankEvent = {
  options: [
    "Apple",
    "Google",
    "iCal",
    "Microsoft365",
    "MicrosoftTeams",
    "Outlook.com",
    "Yahoo",
  ] as
    | (
        | "Apple"
        | "Google"
        | "iCal"
        | "Microsoft365"
        | "MicrosoftTeams"
        | "Outlook.com"
        | "Yahoo"
      )[]
    | undefined,
  buttonStyle: "text" as const,
  name: "Manual entry" as const,
  description: "" as const,
  location: "" as const,
  startDate: "today" as const,
  endDate: "" as const,
  startTime: "" as const,
  endTime: "" as const,
  timeZone: "" as const,
} as AddToCalendarButtonProps;

// Create an OpenAI API client (that's edge friendly!)
const config = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(config);

export default async function EventsFromRawText({
  rawText,
  timezone,
}: {
  rawText: string;
  timezone: string;
}) {
  const system = getSystemMessage();
  const prompt = getPrompt(timezone);

  // Ask OpenAI for a streaming completion given the prompt
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",

    messages: [
      {
        role: "system",
        content: system.text,
      },
      {
        role: "user",
        content: rawText,
      },
      { role: "system", content: prompt.text },
    ],
  });

  const choice = res.choices[0];
  if (!choice) {
    return <EventsError rawText={rawText} />;
  }
  const response = choice.message.content;
  if (!response) {
    return <EventsError rawText={rawText} />;
  }

  let events = [] as AddToCalendarButtonProps[];

  try {
    const res = extractJsonFromResponse(response);
    if (!res) {
      return <EventsError rawText={rawText} />;
    }
    events = res.events.map((event) => {
      return {
        options: [
          "Apple",
          "Google",
          "iCal",
          "Microsoft365",
          "MicrosoftTeams",
          "Outlook.com",
          "Yahoo",
        ] as
          | (
              | "Apple"
              | "Google"
              | "iCal"
              | "Microsoft365"
              | "MicrosoftTeams"
              | "Outlook.com"
              | "Yahoo"
            )[]
          | undefined,
        buttonStyle: "text" as const,
        name: event.name,
        description: event.description,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime || undefined,
        endTime: event.endTime || undefined,
        timeZone: event.timeZone,
      };
    });
  } catch (e: unknown) {
    console.log(e);
  }

  if (events.length === 0) {
    return (
      <>
        <EventsError rawText={rawText} response={response || undefined} />
        <div className="p-4"></div>
        <AddToCalendarCard {...blankEvent} />
      </>
    );
  }

  if (events.length >= 0) {
    return (
      <>
        <div className="flex flex-wrap justify-center gap-8">
          {events.length > 0 &&
            events?.map((props) => (
              <AddToCalendarCard {...props} key={props.name} />
            ))}
          {events.length === 0 && <></>}
        </div>
        {process.env.NODE_ENV === "development" && (
          <>
            <div className="p-4"></div>
            <EventsError rawText={rawText} response={response || undefined} />
          </>
        )}
      </>
    );
  }
}
