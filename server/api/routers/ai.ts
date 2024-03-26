import { z } from "zod";
import { OpenAI } from "openai";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  addCommonAddToCalendarPropsFromResponse,
  getPrompt,
  getSystemMessage,
} from "@/lib/prompts";

// Create an OpenAI API client (that's edge friendly!)
const config = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(config);

export const aiRouter = createTRPCRouter({
  // This is a public procedure, meaning it can be called by anyone
  eventFromRawText: protectedProcedure
    .input(
      z.object({
        rawText: z.string(),
        timezone: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const system = getSystemMessage();
      const prompt = getPrompt(input.timezone);
      // Ask OpenAI for a streaming completion given the prompt
      const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
        seed: 42069,

        messages: [
          {
            role: "system",
            content: system.text,
          },
          {
            role: "user",
            content: input.rawText,
          },
          { role: "system", content: prompt.text },
        ],
      });

      const choice = res.choices[0];
      if (!choice) {
        throw new Error("No response from OpenAI (choices[0])");
      }
      const response = choice.message.content;
      if (!response) {
        throw new Error("No response from OpenAI (choice.message.content)");
      }

      const events = addCommonAddToCalendarPropsFromResponse(response);
      return { events, response };
    }),
});
