"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type User } from "@/server/db/types";
import { api } from "@/trpc/react";
import { GOALS } from "@/lib/schemas";

const emoji = {
  hasBio: "🍎",
  hasContact: "🍐",
  createdEvent: "🍌",
  createdList: "🍇",
  addedEventToList: "🍓",
  sharedEvent: "🍊",
  sharedList: "🍋",
  savedEvent: "🍉",
  savedList: "🥝",
  referredFriend: "🍍",
};

const successMessage = {
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

const goalText = {
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

export default function FruitEmojiGoals({ goals }: { goals: User["goals"] }) {
  const router = useRouter();
  const completeGoal = api.user.completeGoal.useMutation({
    onError: () => {
      toast.error("Goal not saved. Please try again.");
    },
    onSuccess: (_, input) => {
      const icon = emoji[input.goal];
      const message = successMessage[input.goal];
      toast(
        <div className="flex items-center justify-center text-sm">
          <div className="text-4xl">{icon}</div>
          <div className="ml-4 flex flex-col gap-1">
            <div className="font-semibold">New Goal Completed</div>
            <div className="">{message}</div>
          </div>
        </div>
      );
      router.refresh();
    },
  });
  if (!goals) {
    return null;
  }
  return (
    <div>
      <h2>Goals</h2>
      {GOALS.map((goal) => (
        <li key={goal} onClick={() => completeGoal.mutate({ goal })}>
          {goals?.[goal] ? emoji[goal] : "✨"} {goalText[goal]}
        </li>
      ))}
    </div>
  );
}
