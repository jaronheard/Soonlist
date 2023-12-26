// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { posthog } from "posthog-js";

Sentry.init({
  dsn: "https://35d541c34f3a87134429ac75e6513a16@o4503934125998080.ingest.sentry.io/4506458761396224",
  tracesSampleRate: 1.0,
  integrations: [
    new posthog.SentryIntegration(posthog, "soonlist", 4506458761396224),
  ],
});
