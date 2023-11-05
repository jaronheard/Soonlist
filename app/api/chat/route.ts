import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { RequestResponse } from "@prisma/client";
import { getPrompt } from "@/lib/prompts";

export const dynamic = "force-dynamic";
export const runtime = "edge";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  const { messages, source } = await req.json();
  const key = JSON.stringify(messages); // come up with a key based on the request
  const requestStart = new Date();
  const cached = await kv.get(key);
  if (cached) {
    return new Response(cached as any);
  }
  const prompt = getPrompt();

  const userMessages = messages.filter(
    (message: { role: string }) => message.role === "user"
  );
  const lastUserMessage =
    userMessages?.[userMessages.length - 1]?.content || null;

  const requestData = {
    modelInput: {
      promptVersion: prompt.version,
      message: lastUserMessage,
    },
    modelStatus: "pending",
    source: source,
  } as unknown as RequestResponse;

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-4",

    messages: [
      {
        role: "system",
        content: prompt.text,
      },
      {
        role: "user",
        content: lastUserMessage,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      let errors = [];

      // Cache the response. Note that this will also cache function calls.
      kv.set(key, completion).catch((error) => errors.push(error));
      kv.expire(key, 60 * 60).catch((error) => errors.push(error));

      // calculate time from initial request to completion
      const time = new Date().getTime() - requestStart.getTime();

      // Create a new requestResponse in the database, but don't await it
      requestData.modelOutput = { text: completion };
      requestData.modelCompletionTime = time;
      requestData.modelStatus = "success";

      // post requestData to /api/gpt-logs endpoint
      console.log("prior to gpt-logs fetch requestData", requestData);
      fetch("/api/gpt-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }).catch((error) => errors.push(error));
    },
  });

  return new StreamingTextResponse(stream);
}
