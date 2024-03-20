import { OpenAI } from "openai";
import EventsError from "./EventsError";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import {
  addCommonAddToCalendarPropsFromResponse,
  getPrompt,
  getSystemMessage,
} from "@/lib/prompts";
import { blankEvent } from "@/lib/utils";
import { EventPreview } from "@/components/EventListItem";

// Create an OpenAI API client (that's edge friendly!)
const config = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(config);

export default async function EventsFromRawText({
  rawText,
  timezone,
  filePath,
}: {
  rawText: string;
  timezone: string;
  filePath?: string;
}) {
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
    return <EventsError rawText={rawText} />;
  }
  const response = choice.message.content;
  if (!response) {
    return <EventsError rawText={rawText} />;
  }

  const events = addCommonAddToCalendarPropsFromResponse(response);

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
            // <Event
            //   visibility="public"
            //   key={props.name}
            //   user={undefined}
            //   eventFollows={[]}
            //   comments={[]}
            //   id={""}
            //   createdAt={undefined}
            //   event={props}
            // >
            //   {filePath ? (
            //     <div className="flex items-center justify-center">
            //       <ImageUpload filePath={filePath} />
            //     </div>
            //   ) : (
            //     <div></div>
            //   )}
            // </Event>
            <EventPreview
              key={props.name}
              user={undefined}
              eventFollows={[]}
              comments={[]}
              id={""}
              createdAt={undefined}
              event={props}
              visibility="public"
            />
          ))}
        {events.length === 0 && <></>}
      </div>
    );
  }
}
