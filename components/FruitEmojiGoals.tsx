"use client";

import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type User } from "@/server/db/types";
import { api } from "@/trpc/react";
import { GOALS, emoji, successMessage, goalText } from "@/lib/goalsAndFruit";

export default function FruitEmojiGoals({ goals }: { goals: User["goals"] }) {
  const router = useRouter();
  const completeGoal = api.user.completeGoal.useMutation({
    onError: () => {
      toast.error("Goal not saved. Please try again.");
    },
    onSuccess: (result, input) => {
      const icon = emoji[input.goal];
      const message = successMessage[input.goal];
      const totalFruits = Object.values(result.fruits).reduce(
        (acc, val) => acc + val,
        0
      );
      toast(
        <div className="flex items-center justify-center text-sm">
          <div className="text-4xl">{icon}</div>
          <div className="ml-4 flex flex-col gap-1">
            {/* <div className="font-semibold">New Goal Completed</div> */}
            <div className="">{message}</div>
            <div className="text-xs">
              You now have <strong>{totalFruits}</strong> fruits in your basket.
            </div>
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
    <div className="div">
      <div>
        <h2>Goals</h2>
        {GOALS.map((goal) => (
          <li key={goal} onClick={() => completeGoal.mutate({ goal })}>
            {goals?.[goal] ? emoji[goal] : "✨"} {goalText[goal]}
          </li>
        ))}
      </div>
      <div>
        <h2>Total Fruit</h2>
      </div>
    </div>
  );
}
