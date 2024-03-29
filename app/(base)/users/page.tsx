// import { Suspense } from "react";
import { type Metadata, type ResolvingMetadata } from "next/types";
import { UserInfo } from "@/components/UserInfo";
// import Leaderboard from "@/components/Leaderboard";
// import LeaderboardSkeleton from "@/components/LeaderboardSkeleton";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
import { api } from "@/trpc/server";

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `All users | Soonlist`,
    openGraph: {
      title: `All users`,
      description: `See all users on  Soonlist`,
      url: `${process.env.NEXT_PUBLIC_URL}/users`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page() {
  const users = await api.user.getAll.query();

  return (
    <div className="mx-auto max-w-2xl">
      {/* <Card>
        <CardHeader>
          <CardTitle>Top Users</CardTitle>
          <CardDescription>Most Upcoming Events</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LeaderboardSkeleton />}>
            <Leaderboard />
          </Suspense>
        </CardContent>
      </Card>
      <div className="p-4"></div> */}
      <div className="flex place-items-center">
        <p className="font-heading text-5xl font-bold leading-[3.5rem] tracking-tight text-neutral-1">
          All users
        </p>
      </div>
      <div className="p-4"></div>
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <UserInfo key={user.username} userName={user.username} />
        ))}
      </div>
      <div className="p-4"></div>
    </div>
  );
}
