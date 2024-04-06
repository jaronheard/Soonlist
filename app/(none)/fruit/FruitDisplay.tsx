"use client";

import { useState } from "react";
import { FRUITS, fruits } from "@/lib/goalsAndFruit";
import { type User } from "@/server/db/types";
import { Button } from "@/components/ui/button";

export function FruitDisplay({ user }: { user: User }) {
  const [randomizedFruits, setRandomizedFruits] = useState(FRUITS);

  const handleRandomize = () => {
    const shuffledFruits = [...FRUITS].sort(() => Math.random() - 0.5);
    setRandomizedFruits(shuffledFruits);
  };

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="flex flex-wrap justify-center gap-4">
        {randomizedFruits.map((fruit) => {
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
        })}
      </div>
      <Button
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        onClick={handleRandomize}
      >
        Randomize
      </Button>
    </div>
  );
}
