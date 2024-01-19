import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { followList, list, user } from "@/server/db/schema";
import { generatePublicId } from "@/lib/utils";

export const listRouter = createTRPCRouter({
  getAllForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      const users = ctx.db.query.user.findMany({
        where: eq(user.username, input.userName),
        with: {
          list: {
            orderBy: (list, { asc }) => [asc(list.updatedAt)],
            with: {
              // userId replaced here
              user: {
                columns: { id: true, username: true },
              },
              // event to list replaced count
              eventToList: true,
            },
          },
        },
      });
      return users.then((users) => users[0]?.list || []);
    }),
  getFollowing: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      const followLists = ctx.db.query.followList.findMany({
        where: eq(user.username, input.userName),
        with: {
          list: {
            // not sure why this is needed or not working
            // orderBy: (list, { asc }) => [asc(list.updatedAt)],
            with: {
              // userId replaced here
              user: {
                columns: { id: true, username: true },
              },
              // event to list replaced count
              eventToList: true,
            },
            columns: {
              id: true,
              name: true,
              description: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      return followLists.then(
        (followList) => followList?.map((item) => item.list) || null
      );
    }),
  get: publicProcedure
    .input(z.object({ listId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.list
        .findMany({
          where: eq(list.id, input.listId),
          columns: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
          with: {
            event: { with: { user: true, followEvent: true, comment: true } },
            user: true,
            followList: true,
          },
        })
        .then((lists) => lists[0] || null);
    }),
  follow: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.insert(followList).values({
        userId: userId,
        listId: input.listId,
      });
    }),
  unfollow: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db
        .delete(followList)
        .where(
          and(
            eq(followList.userId, userId),
            eq(followList.listId, input.listId)
          )
        );
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      const id = generatePublicId();
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db
        .insert(list)
        .values({
          id: id,
          userId: userId,
          name: input.name,
          description: input.description,
        })
        .then(() => ({
          id,
        }));
    }),
  update: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db
        .update(list)
        .set({
          name: input.name,
          description: input.description,
        })
        .where(eq(list.id, input.listId))
        .then(() => ({ id: input.listId }));
    }),
  delete: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.delete(list).where(eq(list.id, input.listId));
    }),
});
