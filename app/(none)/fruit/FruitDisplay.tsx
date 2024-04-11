"use client";

import { useState } from "react";
import { FRUITS, fruits } from "@/lib/goalsAndFruit";
import { type User } from "@/server/db/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function FruitDisplay({ user }: { user: User }) {
  const [randomizedFruits, setRandomizedFruits] = useState<string[]>([]);

  const handleRandomize = () => {
    const allFruits = FRUITS.flatMap((fruit) => {
      const count = user?.fruits?.[fruit] || 0;
      return Array(count).fill(fruits[fruit].emoji);
    });
    const shuffledFruits = [...allFruits].sort(() => Math.random() - 0.5);
    setRandomizedFruits(shuffledFruits);
  };

  const handleShare = () => {
    const fruitString =
      randomizedFruits.length > 0
        ? randomizedFruits.join("")
        : FRUITS.flatMap((fruit) => {
            const count = user?.fruits?.[fruit] || 0;
            return Array(count).fill(fruits[fruit].emoji);
          }).join("");

    if (navigator.share) {
      void navigator.share({
        text: fruitString,
      });
    } else {
      void navigator.clipboard.writeText(fruitString).then(() => {
        alert("Fruit emojis copied to clipboard!");
      });
    }
  };

  const totalFruitCount = FRUITS.reduce((total, fruit) => {
    const count = user?.fruits?.[fruit] || 0;
    return total + count;
  }, 0);

  return (
    <div className="relative mx-auto max-w-2xl pb-16">
      <div className="mb-4 flex justify-center space-x-4">
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" size="icon">
              {totalFruitCount}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>You have {totalFruitCount} fruit</DialogTitle>
              <FruitChart user={user} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Button onClick={handleRandomize}>Randomize</Button>
        <Button onClick={handleShare} variant={"secondary"}>
          Share
        </Button>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {randomizedFruits.length === 0
          ? FRUITS.flatMap((fruit) => {
              const count = user?.fruits?.[fruit] || 0;
              const emojis = Array(count).fill(fruits[fruit].emoji);
              return emojis.map((emoji, index) => (
                <div
                  key={`${fruit}-${index}`}
                  className="cursor-pointer rounded-full bg-transparent p-4 transition duration-300 ease-in-out hover:scale-125"
                >
                  <div className="text-4xl">{emoji}</div>
                </div>
              ));
            })
          : randomizedFruits.map((emoji, index) => (
              <div
                key={`fruit-${index}`}
                className="cursor-pointer rounded-full bg-transparent p-4 transition duration-300 ease-in-out hover:scale-125"
              >
                <div className="text-4xl">{emoji}</div>
              </div>
            ))}
      </div>
      <FruitChart user={user} />
    </div>
  );
}

function FruitChart({ user }: { user: User }) {
  return (
    <div className="mt-8">
      {FRUITS.map((fruit) => {
        const count = user?.fruits?.[fruit] || 0;
        const maxCount = FRUITS.reduce((max, fruit) => {
          const count = user?.fruits?.[fruit] || 0;
          return Math.max(max, count);
        }, 0);
        const percentage = (count / (maxCount + 10)) * 100;

        return (
          <div key={fruit} className="mb-4 flex items-center">
            <div className="mr-2 text-2xl">{fruits[fruit].emoji}</div>
            <div className="w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-4 rounded-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="ml-2 text-lg font-bold">{count}</div>
          </div>
        );
      })}
    </div>
  );
}
