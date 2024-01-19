import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { waitlist } from "@/server/db/schema";
import { generatePublicId } from "@/lib/utils";

export const waitlistRouter = createTRPCRouter({
  // This is a public procedure, meaning it can be called by anyone
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        zipcode: z.string(),
        why: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(waitlist).values({
        id: generatePublicId(),
        email: input.email,
        zipcode: input.zipcode,
        why: input.why || "",
      });
    }),
});
