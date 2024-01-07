import { OpenAI } from "openai";
import EventsError from "./EventsError";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import { generatedIcsArrayToEvents } from "@/lib/utils";
import { AddToCalendarButtonProps } from "@/types";
import { getPrompt } from "@/lib/prompts";

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

export default async function EventsFromImage({
  imageUrl,
}: {
  imageUrl: string;
}) {
  const prompt = getPrompt();

  // Ask OpenAI for a streaming completion given the prompt
  const res = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    max_tokens: 150,
    messages: [
      {
        role: "system",
        content: prompt.text,
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Use the text in this image" },
          {
            type: "image_url",
            image_url: {
              url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
            },
          },
        ],
      },
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
    events = generatedIcsArrayToEvents(response);
  } catch (e: any) {
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
            events?.map((props, index) => (
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
