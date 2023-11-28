import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const eventRouter = createTRPCRouter({
  getForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findMany({
        where: {
          OR: [
            {
              User: {
                username: {
                  equals: input.userName,
                },
              },
            },
            {
              FollowEvent: {
                some: {
                  User: {
                    username: {
                      equals: input.userName,
                    },
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          startDateTime: "asc",
        },
        include: {
          User: true,
          FollowEvent: true,
          Comment: true,
        },
      });
    }),
  getFollowingForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findMany({
        where: {
          OR: [
            {
              User: {
                followedByUsers: {
                  some: {
                    Follower: {
                      username: input.userName,
                    },
                  },
                },
              },
            },
            {
              eventList: {
                some: {
                  User: {
                    followedByUsers: {
                      some: {
                        Follower: {
                          username: input.userName,
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          startDateTime: "asc",
        },
        include: {
          User: true,
          FollowEvent: true,
          Comment: true,
        },
      });
    }),
  getSavedForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findMany({
        where: {
          FollowEvent: {
            some: {
              User: {
                username: input.userName,
              },
            },
          },
        },
        orderBy: {
          startDateTime: "asc",
        },
        include: {
          User: true,
          FollowEvent: true,
          Comment: true,
        },
      });
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

      const possibleDuplicateEvents = ctx.db.event.findMany({
        where: {
          startDateTime: {
            gte: startDateTimeLowerBound,
            lte: startDateTimeUpperBound,
          },
        },
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
      return possibleDuplicateEvents;
    }),
  get: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findUnique({
        where: {
          id: input.eventId,
        },
        select: {
          startDateTime: true,
          endDateTime: true,
          id: true,
          event: true,
          createdAt: true,
          userId: true,
          eventList: true,
          User: {
            include: {
              lists: true,
            },
          },
          FollowEvent: true,
          Comment: true,
          visibility: true,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.event.findMany({
      orderBy: {
        startDateTime: "asc",
      },
      include: {
        User: true,
        FollowEvent: true,
        Comment: true,
      },
    });
  }),
});
