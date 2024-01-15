const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand({ parsed: { ...process.env } });

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "upcdn.io",
      },
      {
        protocol: "https",
        hostname: "mirrors.creativecommons.org",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/ingest/:path*",
          destination: "https://app.posthog.com/:path*",
        },
      ],
    };
  },
};

const withVercelToolbar = require("@vercel/toolbar/plugins/next")();
// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withVercelToolbar(
  withSentryConfig(
    nextConfig,
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,
      org: "soonlist",
      project: "soonlist",
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: false,

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors.
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    }
  )
);
