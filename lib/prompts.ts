import { Temporal } from "@js-temporal/polyfill";
import soft from "timezone-soft";

// parse the response text into array of events. response format is:
interface Response {
  events: Event[]; // An array of events.
}

export const PLATFORMS = ["instagram", "unknown"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const AGE_RESTRICTIONS = ["all-ages", "18+", "21+", "unknown"] as const;
export type AgeRestriction = (typeof AGE_RESTRICTIONS)[number];

export const PRICE_TYPE = [
  "free",
  "notaflof",
  "donation",
  "paid",
  "unknown",
] as const;
export type PriceType = (typeof PRICE_TYPE)[number];

export const EVENT_CATEGORIES = [
  "music",
  "arts",
  "food",
  "sports",
  "business",
  "tech",
  "education",
  "entertainment",
  "health",
  "lifestyle",
  "literature",
  "science",
  "religion",
  "community",
  "civic",
  "culture",
  "unknown",
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_TYPES = [
  "concert",
  "festival",
  "conference",
  "seminar",
  "workshop",
  "webinar",
  "meeting",
  "party",
  "show",
  "performance",
  "exhibition",
  "competition",
  "game",
  "action",
  "opening",
  "unknown",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const ACCESSIBILITY_TYPES = [
  "masksRequired",
  "masksSuggested",
  "wheelchairAccessible",
  "signLanguageInterpretation",
  "closedCaptioning",
];
export type AccessibilityType = (typeof ACCESSIBILITY_TYPES)[number];

export interface Metadata {
  mentions?: string[]; // An array of mentions of usernames or handles in the input text, excluding at sign.
  source?: Platform; // The source platform from which the input text was extracted.
  price?: number; // The cost of the event in dollars.
  priceType: PriceType;
  ageRestriction: AgeRestriction;
  category: EventCategory;
  type: EventType;
  performers?: string[]; // An array of performers or speakers at the event, if known. Infer if not explicitly stated.
  accessibility?: AccessibilityType[]; // An array of known accessibility features available at the event.
  accessibilityNotes?: string; // Any additional notes about the event's accessibility.
}
export interface Event {
  name: string; // The event's name. Be specific and include any subtitle or edition. Do not include the location.
  description: string; // Short description of the event, its significance, and what attendees can expect. If included in the source text, include the cost, allowed ages, rsvp details, performers, speakers, and any known times.
  startDate: string; // Start date in YYYY-MM-DD format.
  startTime?: string; // Start time. ALWAYS include if known. Omit ONLY if known to be an all-day event.
  endDate: string; // End date in YYYY-MM-DD format.
  endTime?: string; // End time. ALWAYS include, inferring if necessary. Omit ONLY known to be an all-day event.
  timeZone: string; // Timezone in IANA format.
  location: string; // Location of the event.
  metadata: Metadata;
}

export const extractJsonFromResponse = (response: string) => {
  try {
    const start = response.indexOf("```json");
    const end = response.lastIndexOf("```");
    if (start === -1 || end === -1) {
      return JSON.parse(response) as Response;
    }
    const jsonString = response.slice(start + 7, end);
    return JSON.parse(jsonString) as Response;
  } catch (error) {
    console.error("An error occurred while parsing the JSON response:", error);
    return undefined; // or handle the error in a way that is appropriate for your application
  }
};

export const addCommonAddToCalendarProps = (events: Event[]) => {
  return events.map((event) => {
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
      metadata: event.metadata || undefined,
    };
  });
};

export const addCommonAddToCalendarPropsFromResponse = (response: string) => {
  const res = extractJsonFromResponse(response);
  if (!res) return undefined;
  const { events } = res;
  return addCommonAddToCalendarProps(events);
};

export const systemMessage = () =>
  `You are a sophisticated AI capable of parsing text or images to extract calendar event details. Your outputs are structured, reliable, and candid, formatted in JSON according to a specific schema. You make assumptions when necessary but remain factual and direct. You admit uncertainties and avoid unfounded statements, ensuring every piece of information is backed up by the data provided or logical inference. Your responses are concise, prioritizing clarity and relevance to the task. You follow the JSON schema exactly.`;

export const getText = (date: string, timezone: string) => `# CONTEXT
The current date is ${date}, and the default timezone is ${timezone} unless specified otherwise.

## YOUR JOB
Above, I pasted a text or image from which to extract calendar event details for upcoming events.

You will
1. Identify the event details that need to be captured.
2. Identify the platform from which the input text was extracted, and extract all usernames @-mentioned.
3. Extract and format these details into a JSON response, strictly following the schema below. JSON comments are not allowed.
4. Infer any missing information based on event context, type, or general conventions.
5. Write your JSON response by summarizing the event details from the provided data or your own inferred knowledge. Your response must be detailed, specific, and directly relevant to the JSON schema requirements.

Your answer should be fact-filled and SPECIFIC, providing information like ticket prices, main attractions, performers/speakers, registration link, contact information, official hashtags age restrictions, dress code, amenities available, sponsors.
Stylistically write as though a Professor or The Economist would, in short, approachable, and professional language.
No new adjectives, stick to the facts, and be concise. Use proper capitalization for all fields.

## JSON Schema

interface Response {
  events: Event[]; // An array of events.
}

enum Platform {
  "instagram",
  "unknown",
}

enum AgeRestriction {
  "all-ages", // default assumption
  "18+",
  "21+",
  "unknown",
}

enum PriceType {
  "free", // default assumption
  "notaflof", // no one turned away for lack of funds
  "donation",
  "paid",
  "unknown",
}

enum EventCategory {
  "music",
  "arts",
  "food",
  "sports",
  "business",
  "tech",
  "education",
  "entertainment",
  "health",
  "lifestyle",
  "literature",
  "science",
  "religion",
  "community",
  "civic",
  "culture",
  "unknown",
}

enum EventType {
  "concert",
  "festival",
  "conference",
  "seminar",
  "workshop",
  "webinar",
  "meeting",
  "party",
  "show",
  "performance",
  "exhibition",
  "competition",
  "game",
  "action",
  "opening",
  "unknown",
}

enum AccessibilityTypes {
  "masksRequired",
  "masksSuggested",
  "wheelchairAccessible",
  "signLanguageInterpretation",
  "closedCaptioning",
}
  
interface Metadata {
  mentions?: string[]; // An array of mentions of usernames or handles in the input text, excluding at sign.
  source?: Platform; // The source platform from which the input text was extracted.
  price?: number; // The cost of the event in dollars.
  priceType: PriceType;
  ageRestriction: AgeRestriction;
  category: EventCategory;
  type: EventType;
  performers?: string[]; // An array of all performers or speakers at the event, if known. Infer if not explicitly stated.
  accessibility?: AccessibilityTypes[]; // An array of known accessibility features available at the event.
  accessibilityNotes?: string; // Any additional notes about the event's accessibility.
}

interface Event {
  name: string; // The event's name. Be specific and include any subtitle or edition. Do not include the location.
  description: string; // Short description of the event, its significance, and what attendees can expect. If included in the source text, include the cost, allowed ages, rsvp details, performers, speakers, and any known times.
  startDate: string; // Start date in YYYY-MM-DD format.
  startTime?: string; // ISO 8601 FORMAT ONLY. Only omit if known to be an all-day event.
  endDate: string; // End date in YYYY-MM-DD format.
  endTime?: string; // ISO 8601 FORMAT ONLY. Infer based on start time and event type if not specified. Only omit if known to be an all-day event. CANNOT BE UNKNOWN.
  timeZone: string; // Timezone in IANA format.
  location: string; // Location of the event.
  metadata: Metadata;
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

  return {
    text: getText(date, timezoneIANA),
    version: "v2024.02.14.1",
  };
};

export const getSystemMessage = () => {
  return {
    text: systemMessage(),
    version: "v2024.03.16.1",
  };
};
