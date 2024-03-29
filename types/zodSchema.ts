import { z } from "zod";

const dateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  startTime: z.string().optional(),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  timeZone: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["TENTATIVE", "CONFIRMED", "CANCELLED"]).optional(),
  sequence: z.number().optional(),
  uid: z.string().optional(),
  organizer: z.string().optional(),
  attendee: z.string().optional(),
});

export const AddToCalendarButtonPropsSchema = z.object({
  proKey: z.string().optional(),
  name: z.string().optional(),
  dates: z.array(dateSchema).optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  startTime: z.string().optional(),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  timeZone: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["TENTATIVE", "CONFIRMED", "CANCELLED"]).optional(),
  sequence: z.number().optional(),
  uid: z.string().optional(),
  organizer: z.string().optional(),
  attendee: z.string().optional(),
  icsFile: z.string().optional(),
  images: z.union([z.array(z.string()), z.string()]).optional(),
  recurrence: z.string().optional(),
  recurrence_interval: z.number().optional(),
  recurrence_until: z.string().optional(),
  recurrence_count: z.number().optional(),
  recurrence_byDay: z.string().optional(),
  recurrence_byMonth: z.string().optional(),
  recurrence_byMonthDay: z.string().optional(),
  recurrence_weekstart: z.string().optional(),
  availability: z.enum(["busy", "free"]).optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
  identifier: z.string().optional(),
  subscribe: z.boolean().optional(),
  options: z
    .array(
      z.enum([
        "Apple",
        "Google",
        "iCal",
        "Microsoft365",
        "MicrosoftTeams",
        "Outlook.com",
        "Yahoo",
      ])
    )
    .optional(),
  iCalFileName: z.string().optional(),
  listStyle: z
    .enum(["overlay", "modal", "dropdown", "dropdown-static", "dropup-static"])
    .optional(),
  buttonStyle: z
    .enum([
      "default",
      "3d",
      "flat",
      "round",
      "neumorphism",
      "text",
      "date",
      "custom",
      "none",
    ])
    .optional(),
  trigger: z.enum(["hover", "click"]).optional(),
  inline: z.boolean().optional(),
  buttonsList: z.boolean().optional(),
  hideIconButton: z.boolean().optional(),
  hideIconList: z.boolean().optional(),
  hideIconModal: z.boolean().optional(),
  hideTextLabelButton: z.boolean().optional(),
  hideTextLabelList: z.boolean().optional(),
  hideBackground: z.boolean().optional(),
  hideCheckmark: z.boolean().optional(),
  hideBranding: z.boolean().optional(),
  hideButton: z.boolean().optional(),
  size: z.string().optional(),
  label: z.string().optional(),
  inlineRsvp: z.string().optional(),
  customLabels: z.any().optional(), // Replace with a more specific schema if available
  customCss: z.string().optional(),
  lightMode: z.enum(["system", "dark", "light", "bodyScheme"]).optional(),
  language: z
    .enum([
      "en",
      "de",
      "nl",
      "fa",
      "fr",
      "es",
      "et",
      "pt",
      "tr",
      "zh",
      "ar",
      "hi",
      "pl",
      "ro",
      "id",
      "no",
      "fi",
      "sv",
      "cs",
      "ja",
      "it",
      "ko",
      "vi",
    ])
    .optional(),
  hideRichData: z.boolean().optional(),
  ty: z.any().optional(), // Replace with a more specific schema if available
  rsvp: z.any().optional(), // Replace with a more specific schema if available
  bypassWebViewCheck: z.boolean().optional(),
  debug: z.boolean().optional(),
  cspnonce: z.string().optional(),
  blockInteraction: z.boolean().optional(),
  styleLight: z.string().optional(),
  styleDark: z.string().optional(),
  disabled: z.boolean().optional(),
  hidden: z.boolean().optional(),
  pastDateHandling: z.string().optional(),
  proxy: z.boolean().optional(),
  forceOverlay: z.boolean().optional(),
});
