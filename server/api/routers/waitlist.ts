import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const waitlistRouter = createTRPCRouter({
  // This is a public procedure, meaning it can be called by anyone
  create: publicProcedure
    .input(
      z.object({
        email: z.string(),
        zipcode: z.string(),
        why: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.waitlist.create({
        data: {
          email: input.email,
          zipcode: input.zipcode,
          why: input.why || "",
        },
      });
    }),
});
