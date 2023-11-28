import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getByUsername: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          username: input.userName,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      orderBy: {
        username: "asc",
      },
    });
  }),
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
  getIfFollowing: publicProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.followUser.findUnique({
        where: {
          followerId_followingId: {
            followerId: input.followerId,
            followingId: input.followingId,
          },
        },
      });
    }),
});
