import { z } from "zod";
import { eq, lt, gte, ne, asc, and, inArray } from "drizzle-orm";

import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { followUser, user } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const users = ctx.db.query.user.findMany({
        where: eq(user.id, input.id),
      });
      return users.then((users) => users[0] || null);

      // return ctx.db.select().from(user).where(eq(user.id, input.id));
    }),
  getByUsername: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      const users = ctx.db.query.user.findMany({
        where: eq(user.username, input.userName),
      });
      return users.then((users) => users[0] || null);
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.user.findMany({
      orderBy: [asc(user.username)],
    });
  }),
  getFollowing: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.followUser
        .findMany({
          where: eq(followUser.followerId, input.userName),
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
          ctx.db.select().from(user).where(inArray(user.id, userIds))
        );
    }),
  getIfFollowing: publicProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(followUser)
        .where(
          and(
            eq(followUser.followerId, input.followerId),
            eq(followUser.followingId, input.followingId)
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
      return ctx.db.insert(followUser).values({
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
        .delete(followUser)
        .where(
          and(
            eq(followUser.followerId, userId),
            eq(followUser.followingId, input.followingId)
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
