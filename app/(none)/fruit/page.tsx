/* eslint-disable react/no-unescaped-entities */

import { currentUser } from "@clerk/nextjs";
import FruitEmojiGoals from "@/components/FruitEmojiGoals";
import { api } from "@/trpc/server";
import { FRUITS, fruits } from "@/lib/goalsAndFruit";
import { UserInfo } from "@/components/UserInfo";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Fruit | Soonlist",
  openGraph: {
    title: "Fruit | Soonlist",
  },
};

export default async function Page() {
  const activeUser = await currentUser();
  if (!activeUser) {
    console.error("No currentUser found in fruit/page.tsx");
    return null;
  }
  const user = await api.user.getByUsername.query({
    userName: activeUser.username || "",
  });

  if (!user) {
    throw new Error("No user found in fruit/page.tsx");
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-gradient-to-br from-accent-yellow to-background p-4">
      <Logo />
      <UserInfo userId={user.id} variant="default" />
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap justify-center gap-4">
          {FRUITS.map((fruit) => {
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
      </div>
    </div>
    // <>
    //   {/* display total of each fruit */}
    //   <h1>Total Fruit</h1>
    //   <div className="w-[10ch] break-all text-6xl">
    //     {FRUITS.map((fruit) => {
    //       const count = user?.fruits?.[fruit] || 0;
    //       const emojis = fruits[fruit].emoji.repeat(count);
    //       return emojis;
    //     }).join("")}
    //   </div>
    //   {/* display goals */}
    //   <FruitEmojiGoals goals={user?.goals || {}} />;
    // </>
  );
}
