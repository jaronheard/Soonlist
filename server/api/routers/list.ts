import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const listRouter = createTRPCRouter({
  getFollowing: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.list.findMany({
        where: {
          FollowList: {
            some: {
              User: {
                username: input.userName,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          _count: {
            select: { events: true },
          },
          createdAt: true,
          updatedAt: true,
          User: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
    }),
  get: publicProcedure
    .input(z.object({ listId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.list.findUnique({
        where: {
          id: input.listId,
        },
        select: {
          userId: true,
          name: true,
          description: true,
          events: {
            orderBy: {
              startDateTime: "asc",
            },
            include: {
              User: true,
              FollowEvent: true,
              Comment: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          FollowList: true,
          User: true,
        },
      });
    }),
});
