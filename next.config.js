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
    ],
  },
  experimental: {
    ppr: true,
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
module.exports = withVercelToolbar(nextConfig);
