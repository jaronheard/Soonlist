import { z } from "zod";
import { eq, lt, gte, ne, asc, and, inArray } from "drizzle-orm";

import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { userFollows, users } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users
        .findMany({
          where: eq(users.id, input.id),
        })
        .then((users) => users[0] || null);
      return user;
    }),
  getByUsername: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.db.query.users
        .findMany({
          where: eq(users.username, input.userName),
        })
        .then((users) => users[0] || null);
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findMany({
      orderBy: [asc(users.username)],
    });
  }),
  getFollowing: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.userFollows
        .findMany({
          where: eq(userFollows.followerId, input.userName),
          with: {
            following: true,
          },
          columns: {
            followingId: true,
          },
        })
        .then((followUsers) =>
          followUsers.map((followUser) => followUser.followingId)
        )
        .then((userIds) =>
          ctx.db.select().from(users).where(inArray(users.id, userIds))
        );
    }),
  getIfFollowing: publicProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(userFollows)
        .where(
          and(
            eq(userFollows.followerId, input.followerId),
            eq(userFollows.followingId, input.followingId)
          )
        );
    }),
  follow: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.insert(userFollows).values({
        followerId: userId,
        followingId: input.followingId,
      });
    }),
  unfollow: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db
        .delete(userFollows)
        .where(
          and(
            eq(userFollows.followerId, userId),
            eq(userFollows.followingId, input.followingId)
          )
        );
    }),
  // getTopUsersByUpcomingEvents: publicProcedure
  //   .input(z.object({ limit: z.number() }))
  //   .query(async ({ ctx, input }) => {
  //     const excludeUsers = ["user_2X3xAXHdaKKG8RLZqm72wb119Yj"];
  //     const currentDate = new Date();

  //     const leaderboardUsers = await ctx.db.user.findMany({
  //       where: {
  //         id: {
  //           notIn: excludeUsers,
  //         },
  //       },
  //       select: {
  //         id: true,
  //         username: true,
  //         displayName: true,
  //         imageUrl: true,
  //         _count: {
  //           select: {
  //             events: {
  //               where: {
  //                 startDateTime: {
  //                   gt: currentDate,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       orderBy: {
  //         events: {
  //           _count: "desc",
  //         },
  //       },
  //     });

  //     const sortedLeaderboardUsers = leaderboardUsers
  //       .sort((a, b) => b._count.events - a._count.events)
  //       .slice(0, input.limit)
  //       .filter((user) => user._count.events > 0);

  //     return sortedLeaderboardUsers;
  //   }),
});
