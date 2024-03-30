import { z } from "zod";

export const userAdditionalInfoSchema = z.object({
  bio: z.string().max(150, "Bio must be 150 characters or less").optional(),
  publicEmail: z.string().email("Enter a valid email address").optional(),
  publicPhone: z
    .string()
    .max(20, "Phone number must be 20 digits or less")
    .optional(),
  publicInsta: z
    .string()
    .max(31, "Instagram username must be 31 characters or less")
    .optional(),
  publicWebsite: z
    .string()
    .max(1083, "Website url must be 2083 characters or less")
    .optional(),
});

export const GOALS = [
  "hasBio",
  "hasContact",
  "createdEvent",
  "createdList",
  "addedEventToList",
  "sharedEvent",
  "sharedList",
  "savedEvent",
  "savedList",
  "referredFriend",
] as const;

export const goalSchema = z.enum(GOALS);
export type Goal = z.infer<typeof goalSchema>;

export const userGoalsSchema = z.object({
  hasBio: z.boolean().optional(),
  hasContact: z.boolean().optional(),
  createdEvent: z.boolean().optional(),
  createdList: z.boolean().optional(),
  addedEventToList: z.boolean().optional(),
  sharedEvent: z.boolean().optional(),
  sharedList: z.boolean().optional(),
  savedEvent: z.boolean().optional(),
  savedList: z.boolean().optional(),
  referredFriend: z.boolean().optional(),
});
export type Goals = z.infer<typeof userGoalsSchema>;
