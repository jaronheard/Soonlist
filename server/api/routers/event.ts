import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const eventRouter = createTRPCRouter({
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.event.findFirst({
      orderBy: { createdAt: "desc" },
      select: {
        startDateTime: true,
        endDateTime: true,
        id: true,
        event: true,
        createdAt: true,
        userId: true,
        User: true,
        FollowEvent: true,
        Comment: true,
        visibility: true,
      },
    });
  }),
});
