import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
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
  ],
  ignoredRoutes: [
    "/_vercel/speed-insights/vitals",
    "/.well-known/acme-challenge/(.*)",
    "/.well-known/vercel-user-meta",
    "/__nextjs_original-stack-frame",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
