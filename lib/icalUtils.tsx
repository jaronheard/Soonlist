// TODO: This is super janky but it works for now.
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ICAL from "ical.js";

export const SAMPLE_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
DTSTART;TZID=PDT:20231004T191500
DTEND;TZID=PDT:20231004T204500
RRULE:FREQ=WEEKLY;COUNT=5
SUMMARY:Yoga Foundations Workshop at People's Yoga
END:VEVENT
END:VCALENDAR
` as string;

export type ICSJson = {
  startDate: string;
  endDate: string;
  summary: string;
  location: string;
  details: string;
  rrule: { freq?: string; count?: number };
  timezone?: string;
};

export function convertIcsToJson(icsData: any) {
  // Initialize an array to hold the events
  const events: ICSJson[] = [];

  try {
    // Parse the .ics data
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);

    // Iterate over each event component
    comp.getAllSubcomponents("vevent").forEach((vevent: any) => {
      const event = new ICAL.Event(vevent);

      // Extract data from the event
      const summary = event.summary;
      const location = event.location || undefined;
      const startDate = event.startDate.toString();
      const endDate = event.endDate.toString();
      const details = event.description || undefined;
      const rrule = event.component.getFirstPropertyValue("rrule");
      const timezone = event.startDate.timezone;

      // Create a JSON object for the event and add it to the array
      events.push({
        summary,
        location,
        startDate,
        endDate,
        details,
        rrule,
        timezone,
      });
    });
  } catch (e) {
    console.error(e);
  }

  // You can now work with this JSON object or stringify it
  return events;
}

export function icsJsonToAddToCalendarButtonProps(icsJson: ICSJson) {
  const input = icsJson;
  const { summary, location } = icsJson;
  const description = icsJson.details;
  const startDate = input.startDate.split("T")[0];
  const startTime = input.startDate.split("T")[1]?.substring(0, 5);
  const endDate = input.endDate.split("T")[0];
  const endTime = input.endDate.split("T")[1]?.substring(0, 5);
  const timeZone = input.timezone;
  const rrule = input.rrule;

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
    name: summary,
    description: description,
    location: location,
    startDate: startDate,
    endDate: endDate,
    startTime: startTime || undefined,
    endTime: endTime || undefined,
    timeZone: timeZone,
    recurrence: rrule?.freq || undefined,
    recurrence_count: rrule?.count || undefined,
  };
}

export function generatedIcsArrayToEvents(input: string) {
  try {
    const events = convertIcsToJson(input);
    // to calendar button props
    const addToCalendarButtonPropsArray = events.map((event) =>
      icsJsonToAddToCalendarButtonProps(event)
    );
    return addToCalendarButtonPropsArray;
  } catch (e) {
    console.log(e);
    return [];
  }
}
