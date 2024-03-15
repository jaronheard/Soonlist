// utils/logger.js
import * as Sentry from "@sentry/nextjs";

const logger = {
  error: (...args: unknown[]) => {
    // Here you can filter or modify the error messages if needed

    // Report the error to Sentry
    Sentry.captureException(new Error(args.join(" ")));

    // Log the error to the console as well
    logger.error(...args);
  },
  // You can add more methods for different levels of logging (info, warn, debug, etc.)
};

export default logger;
