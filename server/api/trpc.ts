import { initTRPC, TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";

import {
  type SignedInAuthObject,
  type SignedOutAuthObject,
  type User,
} from "@clerk/nextjs/server";
import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/server/db";

interface CreateContextOptions {
  headers: Headers;
  db: typeof db;
  user: User | null;
  auth: SignedInAuthObject | SignedOutAuthObject;
}

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = auth();
  const user = await currentUser();
  // const session = getAuth(opts)

  return {
    db,
    auth: session,
    currentUser: user,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      auth: ctx.auth,
      currentUser: ctx.currentUser,
      db,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
