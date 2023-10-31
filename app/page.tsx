import { Suspense } from "react";
import AddEvent from "./AddEvent";
import Leaderboard from "@/components/Leaderboard";
import LeaderboardSkeleton from "@/components/LeaderboardSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <>
      <h1 className="max-w-[708px] text-center text-4xl font-bold text-slate-900 sm:text-6xl">
        Now: ⌨️✨📅
      </h1>
      <div className="p">
        Paste event info <span className="font-semibold">&rarr;</span> clean,
        calendarable event
      </div>
      <div className="p-2"></div>
      <h2 className="max-w-[708px] text-center text-xl font-bold text-slate-900 opacity-70 sm:text-4xl">
        Soon: 📣🫂🎉
      </h2>
      <div className="text-sm opacity-70">
        Create, collect, curate & share events
      </div>
      <div className="p-12"></div>
      <AddEvent />
      <div className="p-12"></div>
      <Card>
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
    </>
  );
}
