import * as Bytescale from "@bytescale/sdk";
import { OpenAI } from "openai";
import EventsError from "./EventsError";
import { AddToCalendarCard } from "@/components/AddToCalendarCard.1";
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

  const events = addCommonAddToCalendarPropsFromResponse(response);

  if (!events || events.length === 0) {
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
