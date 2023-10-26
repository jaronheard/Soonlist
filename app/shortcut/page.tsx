import { OpenAIStream } from "ai";
import { Tokens } from "ai/react";
import OpenAI from "openai";

// Create an OpenAI API client (that's edge friendly!)
const config = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI(config);

export const runtime = "edge";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get current date in Month, Day, Year format
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const day = today.getDate();
  const year = today.getFullYear();

  const rawText = searchParams?.rawText?.toString();

  const response =
    rawText &&
    (await openai.chat.completions.create({
      model: "gpt-4",

      stream: true,
      messages: [
        {
          role: "system",
          content: `You parse calendar events from the provided text into iCal format and return the iCal file. Use the following rules:
            # General
            - ONLY RETURN A VALID ICAL FILE
            - DO NOT RETURN ADDITIONAL INFORMATION
            # Time
            - For calculating relative dates/times, it is currently ${month} ${day}, ${year}
            - Include timezone (use America/Los Angeles if not specified)
            - Do not include timezone for full day events
            - If event end time is not specified, guess based on event type
            # File Format
            - ALWAYS INCLUDE THE FOLLOWING FIELDS:
              - BEGIN:VCALENDAR
              - END: VCALENDAR
            - FOR EACH EVENT, THE FOLLOWING FIELDS ARE REQUIRED:
              - DTSTART
              - DTEND
              - SUMMARY
            - FOR EACH EVENT, INCLUDE THE FOLLOWING FIELDS IF AVAILABLE:
              - DESCRIPTION
              - LOCATION
            - FOR EACH EVENT, THE FOLLOWING FIELDS ARE NOT ALLOWED:
              - PRODID
              - VERSION
              - CALSCALE
              - METHOD
              - RRULE
            # Field Content
            - DESCRIPTION
              - Provide a short description of the event, its significance, and what attendees can expect, from the perspective of a reporter.
                - Do not write from the perspective of the event organizer
              - (if relevant) Provide a general agenda in a format that is commonly used for this type of event.
              - (if relevant) Provide information on how people can RSVP or purchase tickets. Include event cost, or note if it is free.
              - (if relevant) Provide information on how people can get more information, ask questions, or get event updates.
              - JUST THE FACTS. Only include known information. Do not include speculation or opinion.
              - BE SUCCINCT AND CLEAR.
              - DO NOT USE NEW ADJECTIVES.
              - BOTH SENTENCE FRAGMENTS AND FULL SENTENCES ARE OK.
            `,
        },
        {
          role: "user",
          content: rawText,
        },
      ],
    }));

  // Convert the response into a friendly text-stream using the SDK's wrappers
  const stream = OpenAIStream(response);

  return <Tokens stream={stream} />;
}
