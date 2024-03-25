import { OpenAI } from "openai";
import { cache } from "react";
import EventsError from "./EventsError";
import { NewEventPreview } from "./NewEventPreview";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import {
  addCommonAddToCalendarPropsFromResponse,
  getPrompt,
  getSystemMessage,
} from "@/lib/prompts";
import { blankEvent } from "@/lib/utils";

// Create an OpenAI API client (that's edge friendly!)
const config = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(config);

export const getEventFromRawText = cache(
  async ({ rawText, timezone }: { rawText: string; timezone: string }) => {
    const system = getSystemMessage();
    const prompt = getPrompt(timezone);
    // Ask OpenAI for a streaming completion given the prompt
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      seed: 42069,

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
      throw new Error("No response from OpenAI (choices[0])");
    }
    const response = choice.message.content;
    if (!response) {
      throw new Error("No response from OpenAI (choice.message.content)");
    }

    const events = addCommonAddToCalendarPropsFromResponse(response);
    return { events, response };
  }
);

export default async function NewEventsFromRawText({
  rawText,
  timezone,
  filePath,
  edit,
}: {
  rawText: string;
  timezone: string;
  filePath?: string;
  edit?: boolean;
}) {
  const { events, response } = await getEventFromRawText({ rawText, timezone });

  if (!events || events.length === 0) {
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
      <div className="flex flex-wrap items-center gap-8">
        {events.length > 0 &&
          events?.map((props) => (
            <NewEventPreview key={props.name} {...props} />
          ))}
        {events.length === 0 && <></>}
      </div>
    );
  }
}
