/* eslint-disable react/no-unescaped-entities */

import { currentUser } from "@clerk/nextjs";
import { FruitDisplay } from "./FruitDisplay";
import FruitEmojiGoals from "@/components/FruitEmojiGoals";
import { api } from "@/trpc/server";
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
      <FruitDisplay user={user} />
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
