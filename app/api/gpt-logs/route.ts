import { db } from "@/server/db";
import { requestResponses } from "@/server/db/schema";

export const dynamic = "force-dynamic";

// todo: convert to trpc
export async function POST(req: Request) {
  const { data } = await req.json();
  const requestResponseRecord = await db.insert(requestResponses).values({
    data,
  } as any);
  console.log("gpt-logs saved to database", requestResponseRecord);
  return new Response(JSON.stringify(data));
}
