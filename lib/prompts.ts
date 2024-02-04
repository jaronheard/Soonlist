import { Temporal } from "@js-temporal/polyfill";
import soft from "timezone-soft";

export const systemMessage = () =>
  `You are a sophisticated AI capable of parsing text or images to extract calendar event details. Your outputs are structured, reliable, and candid, formatted in JSON according to a specific schema. You make assumptions when necessary but remain factual and direct. You admit uncertainties and avoid unfounded statements, ensuring every piece of information is backed up by the data provided or logical inference. Your responses are concise, prioritizing clarity and relevance to the task. You follow the JSON schema exactly.`;

export const getText = (date: string, timezone: string) => `# CONTEXT
The current date is ${date}, and the default timezone is ${timezone} unless specified otherwise.

## YOUR JOB
Above, I pasted a text or image from which to extract calendar event details.

You will
1. Identify the event details that need to be captured.
2. Identify the platform from which the input text was extracted, and extract all usernames @-mentioned.
3. Extract and format these details into a JSON response, strictly following the schema below.
4. Infer any missing information based on event context, type, or general conventions.
5. Write your JSON response by summarizing the event details from the provided data or your own inferred knowledge. Your response must be detailed, specific, and directly relevant to the JSON schema requirements.

Your answer should be fact-filled and SPECIFIC, providing information like ticket prices, main attractions, performers/speakers, registration link, contact information, official hashtags age restrictions, dress code, amenities available, sponsors.
Stylistically write as though a Professor or The Economist would, in short, approachable, and professional language.
No new adjectives, stick to the facts, and be concise.

## JSON Schema

interface Response {
  events: Event[]; // An array of events.
  // metadata
  platform: Platform; // The platform where the input text was extracted from.
  mentions?: string[]; // An array of any relevant mentions or references in the input text. 
}

interface Mention {
  username: string; // The username of the mentioned person.
}

enum MentionType {
  author,
  tag,
  host,
  unknown,
}

enum Platform {
  "instagram",
  "unknown",
}

interface Event {
  name: string; // The event's name. Be specific and include any subtitle or edition. Do not include the location.
  description: string; // Short description of the event, its significance, and what attendees can expect.
  startDate: string; // Start date in YYYY-MM-DD format.
  startTime?: string; // Start time. ALWAYS include if known. Omit ONLY if known to be an all-day event.
  endDate: string; // End date in YYYY-MM-DD format. 
  endTime?: string; // End time. ALWAYS include, inferring if necessary. Omit ONLY known to be an all-day event.
  timeZone: string; // Timezone in IANA format.
  location: string; // Location of the event.
}

Below, your report, following the JSON schema exactly:`;

const formatOffsetAsIANASoft = (offset: string) => {
  const timezone = soft(offset)[0];
  return timezone?.iana || "America/Los_Angeles";
};

export const getPrompt = (timezone = "America/Los_Angeles") => {
  const timezoneIANA = formatOffsetAsIANASoft(timezone);
  const now = Temporal.Now.instant().toZonedDateTimeISO(timezoneIANA);
  const date = now.toString();

  console.log(timezoneIANA);

  return {
    text: getText(date, timezoneIANA),
    version: "v2024.02.04.1",
  };
};

export const getSystemMessage = () => {
  return {
    text: systemMessage(),
    version: "v2024.02.04.1",
  };
};
