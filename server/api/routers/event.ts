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
