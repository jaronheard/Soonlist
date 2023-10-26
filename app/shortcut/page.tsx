// app/page.tsx
import OpenAI from "openai";
import { OpenAIStream } from "ai";
import { Suspense } from "react";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function Page({
  searchParams,
}: {
  // note that using searchParams opts your page into dynamic rendering. See https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
  searchParams: Record<string, string>;
}) {
  // Get current date in Month, Day, Year format
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const day = today.getDate();
  const year = today.getFullYear();

  const response = await openai.chat.completions.create({
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
        content:
          searchParams["rawText"] ?? "Give me code for generating a JSX button",
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  const reader = stream.getReader();

  // We recursively render the stream as it comes in
  return (
    <Suspense>
      <Reader reader={reader} />
    </Suspense>
  );
}

async function Reader({
  reader,
}: {
  reader: ReadableStreamDefaultReader<any>;
}) {
  const { done, value } = await reader.read();

  if (done) {
    return null;
  }

  const text = new TextDecoder().decode(value);

  return (
    <span>
      {text}
      <Suspense>
        <Reader reader={reader} />
      </Suspense>
    </span>
  );
}
