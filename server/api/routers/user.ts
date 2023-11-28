import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getFollowing: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.followUser.findMany({
        where: {
          Follower: {
            username: input.userName,
          },
        },
        select: {
          Following: {
            select: {
              username: true,
            },
          },
        },
      });
    }),
});
