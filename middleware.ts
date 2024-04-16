import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/terms",
  "/contact",
  "/privacy",
  "/early-access",
  "/explore",
  "/onboarding",
  "/events",
  "/users",
  "/api",
  "/api/bug",
  "/api/chat",
  "/api/og",
  "/api/test",
  "/api/leaderboard",
  "/api/webhooks/clerk",
  "/api/image-proxy",
  "/api/trpc(.*)",
  "/(.*)/events",
  "/(.*)/events/(.*)",
  "/(.*)/following/(.*)",
  "/event/(.*)",
  "/list/(.*)",
  "/ingest",
  "/ingest/(.*)",
  "/monitoring(.*)",
]);

const isIgnoredRoute = createRouteMatcher([
  "/_vercel/speed-insights/vitals",
  "/.well-known/acme-challenge/(.*)",
  "/.well-known/vercel-user-meta",
  "/__nextjs_original-stack-frame",
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request) && !isIgnoredRoute(request)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next)._)", "/", "/(api|trpc)(._)"],
};
