import { z } from "zod";

import { Temporal } from "@js-temporal/polyfill";
import { TRPCError } from "@trpc/server";
import { and, asc, eq, gte, lte, or } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { devLog, generatePublicId } from "@/lib/utils";
import {
  event,
  followEvent,
  user,
  comment,
  eventToList,
} from "@/server/db/schema";

const eventCreateSchema = z.object({
  event: z.any(), //TODO: add validation
  comment: z.string().optional(),
  lists: z.array(z.record(z.string().trim())),
  visibility: z.enum(["public", "private"]).optional(),
});

const eventUpdateSchema = z.object({
  id: z.string(),
  event: z.any(),
  comment: z.string().optional(),
  lists: z.array(z.record(z.string().trim())),
  visibility: z.enum(["public", "private"]).optional(),
});

const eventIdSchema = z.object({
  id: z.string(),
});

export const eventRouter = createTRPCRouter({
  getForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      const users = ctx.db.query.user.findMany({
        where: eq(user.username, input.userName),
        with: {
          event: {
            orderBy: [asc(event.startDateTime)],
            with: {
              followEvent: true,
              comment: true,
              user: true,
            },
          },
        },
      });
      return users.then((users) => users[0]?.event || []);
    }),
  getCreatedForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      const users = ctx.db.query.user.findMany({
        where: eq(user.username, input.userName),
        with: {
          event: {
            orderBy: [asc(event.startDateTime)],
            with: {
              followEvent: true,
              comment: true,
              user: true,
            },
          },
        },
      });
      return users.then((users) => users[0]?.event || []);
    }),
  getFollowingForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(async ({ ctx, input }) => {
      const following = await ctx.db.query.user.findMany({
        where: eq(user.username, input.userName),
        columns: {
          username: true,
        },
        with: {
          followList: {
            with: {
              list: {
                with: {
                  event: true,
                },
              },
            },
          },
          followEvent: { with: { event: true } },
        },
      });
      const followedEvents = following.flatMap((user) =>
        user.followEvent.map((followEvent) => followEvent.event)
      );
      const followedLists = following.flatMap((user) =>
        user.followList.flatMap((followList) => followList.list.event)
      );
      // filter out duplicate events
      const allFollowedEvents = [...followedEvents, ...followedLists].reduce(
        (acc, event) => {
          if (!acc.find((e) => e.cuid === event.cuid)) {
            acc.push(event);
          }
          return acc;
        },
        [] as any[]
      );
      return allFollowedEvents.sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime()
      );
    }),
  getSavedForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      const users = ctx.db.query.user.findMany({
        where: eq(user.username, input.userName),
        with: {
          followEvent: {
            with: {
              event: {
                with: {
                  user: true,
                  followEvent: true,
                  comment: true,
                },
              },
            },
          },
        },
      });
      return users.then(
        (users) =>
          users[0]?.followEvent
            .map((followEvent) => followEvent.event)
            .sort(
              (a, b) =>
                new Date(a.startDateTime).getTime() -
                new Date(b.startDateTime).getTime()
            ) || []
      );
    }),
  getPossibleDuplicates: publicProcedure
    .input(z.object({ startDateTime: z.date() }))
    .query(({ ctx, input }) => {
      const { startDateTime } = input;
      // start date time should be within 1 hour of the start date time of the event
      const startDateTimeLowerBound = new Date(startDateTime);
      startDateTimeLowerBound.setHours(startDateTime.getHours() - 1);
      const startDateTimeUpperBound = new Date(startDateTime);
      startDateTimeUpperBound.setHours(startDateTime.getHours() + 1);
      const possibleDuplicateEvents = ctx.db.query.event.findMany({
        where: and(
          gte(event.startDateTime, startDateTimeLowerBound),
          lte(event.startDateTime, startDateTimeUpperBound)
        ),
        with: {
          user: true,
          followEvent: true,
          comment: true,
        },
      });
      return possibleDuplicateEvents;
    }),
  get: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.event
        .findMany({
          where: eq(event.cuid, input.eventId),
          with: {
            user: {
              with: {
                list: true,
              },
            },
            followEvent: true,
            comment: true,
            eventToList: {
              with: {
                list: true,
              },
            },
          },
        })
        .then((events) => events[0] || null);
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.event.findMany({
      orderBy: [asc(event.startDateTime)],
      with: {
        user: true,
        followEvent: true,
        comment: true,
      },
    });
  }),
  getNext: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        excludeCurrent: z.boolean().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.event.findMany({
        where: input?.excludeCurrent
          ? gte(event.endDateTime, new Date())
          : gte(event.startDateTime, new Date()),
        with: {
          user: true,
          followEvent: true,
          comment: true,
        },
        limit: input?.limit,
      });
    }),
  delete: protectedProcedure.input(eventIdSchema).mutation(({ ctx, input }) => {
    const { userId, sessionClaims } = ctx.auth;
    if (!userId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No user id found in session",
      });
    }

    const roles = (sessionClaims?.roles || []) as string[];
    const isAdmin = roles?.includes("admin");

    return ctx.db.query.event
      .findMany({
        where: and(eq(event.cuid, input.id), eq(event.userId, userId)),
        columns: {
          cuid: true,
        },
      })
      .then((events) => events.length > 0)
      .then((isEventOwner) => {
        if (!isEventOwner && !isAdmin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Unauthorized",
          });
        }
        return ctx.db.delete(event).where(eq(event.cuid, input.id));
      })
      .then(() => ({ id: input.id }));
  }),
  update: protectedProcedure
    .input(eventUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId, sessionClaims } = ctx.auth;

      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }

      const roles = (sessionClaims?.roles || []) as string[];
      const isAdmin = roles?.includes("admin");

      const { event } = input;
      const hasComment = input.comment && input.comment.length > 0;
      const hasLists = input.lists && input.lists.length > 0;
      const hasVisibility = input.visibility && input.visibility.length > 0;

      const start = Temporal.ZonedDateTime.from(
        `${event.startDate}T${event.startTime}[${event.timeZone}]`
      );
      const end = Temporal.ZonedDateTime.from(
        `${event.endDate}T${event.endTime}[${event.timeZone}]`
      );
      const startUtc = start.toInstant().toString();
      const endUtc = end.toInstant().toString();

      // check if user is event owner
      const eventOwner = await ctx.db.query.event
        .findMany({
          where: and(eq(event.cuid, input.id), eq(event.userId, userId)),
          columns: {
            cuid: true,
          },
        })
        .then((events) => events.length > 0);

      if (!eventOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      // if user is event owner, update event
      return ctx.db
        .transaction(async (tx) => {
          await ctx.db
            .update(event)
            .set({
              userId: userId,
              event: event,
              startDateTime: startUtc,
              endDateTime: endUtc,
              ...(hasVisibility && {
                visibility: input.visibility,
              }),
            })
            .where(eq(event.cuid, input.id));
          if (hasComment) {
            await ctx.db
              .insert(comment)
              .values({
                id: generatePublicId(),
                content: input.comment || "",
                userId: userId,
                eventId: input.id,
              })
              .onDuplicateKeyUpdate({
                set: { content: input.comment },
              });
          } else {
            await ctx.db.delete(comment).where(eq(comment.eventId, input.id));
          }
          if (hasLists) {
            await ctx.db
              .delete(eventToList)
              .where(eq(eventToList.eventId, input.id));
            await ctx.db.insert(eventToList).values(
              input.lists.map((list) => ({
                eventId: input.id,
                listId: list.value!,
              }))
            );
          } else {
            await ctx.db
              .delete(eventToList)
              .where(eq(eventToList.eventId, input.id));
          }
        })
        .then(() => ({ id: input.id }));
    }),
  create: protectedProcedure
    .input(eventCreateSchema)
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }

      const { event } = input;
      const hasComment = input.comment && input.comment.length > 0;
      const hasLists = input.lists && input.lists.length > 0;
      const hasVisibility = input.visibility && input.visibility.length > 0;

      let startTime = event.startTime;
      let endTime = event.endTime;
      let timeZone = event.timeZone;

      // time zone is America/Los_Angeles if not specified
      if (!timeZone) {
        timeZone = "America/Los_Angeles";
      }

      // start time is 00:00 if not specified
      if (!startTime) {
        startTime = "00:00";
      }
      // end time is 23:59 if not specified
      if (!endTime) {
        endTime = "23:59";
      }

      const start = Temporal.ZonedDateTime.from(
        `${event.startDate}T${startTime}[${timeZone}]`
      );
      const end = Temporal.ZonedDateTime.from(
        `${event.endDate}T${endTime}[${timeZone}]`
      );
      devLog("calculated start and end: ", start, end);
      const startUtc = start.toInstant().toString();
      const endUtc = end.toInstant().toString();
      devLog("calculated start and end UTC: ", startUtc, endUtc);
      const cuid = generatePublicId();

      return ctx.db
        .transaction(async (tx) => {
          await ctx.db.insert(event).values({
            cuid: cuid,
            userId: userId,
            event: event,
            startDateTime: startUtc,
            endDateTime: endUtc,
            ...(hasVisibility && {
              visibility: input.visibility,
            }),
          });
          if (hasComment) {
            await ctx.db.insert(comment).values({
              id: generatePublicId(),
              eventId: cuid,
              content: input.comment || "",
              userId: userId,
            });
          } else {
            // no need to insert comment if there is no comment
          }
          if (hasLists) {
            await ctx.db
              .delete(eventToList)
              .where(eq(eventToList.eventId, cuid));
            await ctx.db.insert(eventToList).values(
              input.lists.map((list) => ({
                eventId: cuid,
                listId: list.value!,
              }))
            );
          } else {
            // no need to insert event to list if there is no list
          }
        })
        .then(() => ({ id: cuid }));
    }),
  follow: protectedProcedure.input(eventIdSchema).mutation(({ ctx, input }) => {
    const { userId } = ctx.auth;
    if (!userId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No user id found in session",
      });
    }
    return ctx.db.insert(followEvent).values({
      userId: userId,
      eventId: input.id,
    });
  }),
  unfollow: protectedProcedure
    .input(eventIdSchema)
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.delete(followEvent).where(eq(followEvent.userId, userId));
    }),
  addToList: protectedProcedure
    .input(z.object({ eventId: z.string(), listId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db
        .insert(eventToList)
        .values({
          eventId: input.eventId,
          listId: input.listId,
        })
        .onDuplicateKeyUpdate({
          set: { eventId: input.eventId, listId: input.listId },
        });
    }),
  removeFromList: protectedProcedure
    .input(z.object({ eventId: z.string(), listId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db
        .delete(eventToList)
        .where(
          and(
            eq(eventToList.eventId, input.eventId),
            eq(eventToList.listId, input.listId)
          )
        );
    }),
});
