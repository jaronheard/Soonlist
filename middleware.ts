import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/new",
    "/explore",
    "/old-new",
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
    "/.well-known/acme-challenge/(.*)",
    "/.well-known/vercel-user-meta",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
