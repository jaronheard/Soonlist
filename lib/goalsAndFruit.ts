import { z } from "zod";

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
export const userFruitSchema = z.object({
  apple: z.number().optional(),
  pear: z.number().optional(),
  banana: z.number().optional(),
  grape: z.number().optional(),
  strawberry: z.number().optional(),
  orange: z.number().optional(),
  lemon: z.number().optional(),
  watermelon: z.number().optional(),
  kiwi: z.number().optional(),
  pineapple: z.number().optional(),
});
export type UserFruit = z.infer<typeof userFruitSchema>;
export const FRUITS = [
  "apple",
  "pear",
  "banana",
  "grape",
  "strawberry",
  "orange",
  "lemon",
  "watermelon",
  "kiwi",
  "pineapple",
] as const;
export type Fruit = (typeof FRUITS)[number];
export const fruits = {
  apple: { key: "apple" as Fruit, label: "Apple", emoji: "🍎" },
  pear: { key: "pear" as Fruit, label: "Pear", emoji: "🍐" },
  banana: { key: "banana" as Fruit, label: "Banana", emoji: "🍌" },
  grape: { key: "grape" as Fruit, label: "Grape", emoji: "🍇" },
  strawberry: { key: "strawberry" as Fruit, label: "Strawberry", emoji: "🍓" },
  orange: { key: "orange" as Fruit, label: "Orange", emoji: "🍊" },
  lemon: { key: "lemon" as Fruit, label: "Lemon", emoji: "🍋" },
  watermelon: { key: "watermelon" as Fruit, label: "Watermelon", emoji: "🍉" },
  kiwi: { key: "kiwi" as Fruit, label: "Kiwi", emoji: "🥝" },
  pineapple: { key: "pineapple" as Fruit, label: "Pineapple", emoji: "🍍" },
} as const;
export const goalsToFruits = {
  hasBio: fruits.apple,
  hasContact: fruits.pear,
  createdEvent: fruits.banana,
  createdList: fruits.grape,
  addedEventToList: fruits.strawberry,
  sharedEvent: fruits.orange,
  sharedList: fruits.lemon,
  savedEvent: fruits.watermelon,
  savedList: fruits.kiwi,
  referredFriend: fruits.pineapple,
} as const;
export const emoji = {
  hasBio: fruits.apple.emoji,
  hasContact: fruits.pear.emoji,
  createdEvent: fruits.banana.emoji,
  createdList: fruits.grape.emoji,
  addedEventToList: fruits.strawberry.emoji,
  sharedEvent: fruits.orange.emoji,
  sharedList: fruits.lemon.emoji,
  savedEvent: fruits.watermelon.emoji,
  savedList: fruits.kiwi.emoji,
  referredFriend: fruits.pineapple.emoji,
};
export const getRandomFruit = () => {
  const fruitKeys = Object.keys(fruits) as Fruit[];
  return fruitKeys[Math.floor(Math.random() * fruitKeys.length)];
};
export const successMessage = {
  hasBio: "You added a bio and earned an apple!",
  hasContact: "You added contact info and earned a pear!",
  createdEvent: "You created an event and earned a banana!",
  createdList: "You created a list and earned a grape!",
  addedEventToList: "You added an event to a list and earned a strawberry!",
  sharedEvent: "You shared an event and earned an orange!",
  sharedList: "You shared a list and earned a lemon!",
  savedEvent: "You saved an event and earned a watermelon!",
  savedList: "You saved a list and earned a kiwi!",
  referredFriend: "You referred a friend and earned a pineapple!",
};
export const goalText = {
  hasBio: "Add a bio",
  hasContact: "Add contact info",
  createdEvent: "Create an event",
  createdList: "Create a list",
  addedEventToList: "Add an event to a list",
  sharedEvent: "Share an event",
  sharedList: "Share a list",
  savedEvent: "Save an event",
  savedList: "Save a list",
  referredFriend: "Refer a friend",
};
