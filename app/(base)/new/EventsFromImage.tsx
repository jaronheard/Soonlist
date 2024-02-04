import * as Bytescale from "@bytescale/sdk";
import { OpenAI } from "openai";
import EventsError from "./EventsError";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
// import { generatedIcsArrayToEvents } from "@/lib/icalUtils";
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

function buildDefaultUrl(filePath: string) {
  return Bytescale.UrlBuilder.url({
    accountId: "12a1yek",
    filePath: filePath,
    options: {},
  });
}

export default async function EventsFromImage({
  filePath,
  timezone,
}: {
  filePath: string;
  timezone: string;
}) {
  const system = getSystemMessage();
  const prompt = getPrompt(timezone);
  const imageUrl = buildDefaultUrl(filePath);

  // Ask OpenAI for a streaming completion given the prompt
  const res = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    max_tokens: 1000,
    messages: [
      {
        role: "system",
        content: system.text,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
      { role: "system", content: prompt.text },
    ],
  });

  const choice = res.choices[0];
  if (!choice) {
    return <EventsError rawText={imageUrl} />;
  }
  const response = choice.message.content;
  if (!response) {
    return <EventsError rawText={imageUrl} />;
  }

  let events = [] as AddToCalendarButtonProps[];

  try {
    const res = extractJsonFromResponse(response);
    if (!res) {
      throw new Error("Failed to parse response");
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
        <EventsError rawText={imageUrl} response={response || undefined} />
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
            <EventsError rawText={imageUrl} response={response || undefined} />
          </>
        )}
      </>
    );
  }
}
