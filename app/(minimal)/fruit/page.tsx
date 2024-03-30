/* eslint-disable react/no-unescaped-entities */

import { currentUser } from "@clerk/nextjs";
import FruitEmojiGoals from "@/components/FruitEmojiGoals";
import { api } from "@/trpc/server";

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

  return <FruitEmojiGoals goals={user?.goals || {}} />;
}
