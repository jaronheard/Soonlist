import { Suspense } from "react";
// import AddEvent from "../AddEvent";
// import Leaderboard from "@/components/Leaderboard";
import LeaderboardSkeleton from "@/components/LeaderboardSkeleton";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import NextEvents from "@/components/NextEvents";

export default function Page() {
  return (
    <>
      <div className="p-4"></div>
      <h1 className="font-heading text-6xl font-bold leading-[0.875] tracking-tighterish text-gray-700 md:text-8xl md:leading-[0.875]">
        Explore
      </h1>
      <p className="mt-6 max-w-[30rem] text-2xl leading-9 text-gray-400">
        Events from early access users
      </p>
      <div className="max-w-xl">
        <Suspense fallback={<LeaderboardSkeleton />}>
          <NextEvents upcoming />
        </Suspense>
      </div>
      <div className="p-6"></div>
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
      </Card> */}
    </>
  );
}
