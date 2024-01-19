import { z } from "zod";

import { LinearClient } from "@linear/sdk";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const linearRouter = createTRPCRouter({
  createIssue: publicProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .query(({ ctx, input }) => {
      const linearClient = new LinearClient({
        apiKey: process.env.LINEAR_API_KEY,
      });

      const issue = linearClient.createIssue({
        teamId: process.env.LINEAR_TEAM_ID!,
        title: input.title,
        description: input.description,
      });

      return issue;
    }),
});
