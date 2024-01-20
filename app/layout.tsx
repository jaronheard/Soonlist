import { Metadata } from "next";
import "@/styles/globals.css";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { PHProvider, Providers } from "./providers";
import { TRPCReactProvider } from "@/trpc/react";

export const runtime = "edge";

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

const title = "Soonlist";
const tagline = "Create, collect, curate & share events";
const description =
  "Join a network of passionate curators and participants building community around events that matter.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.soonlist.com/"),
  title,
  description: tagline,
  openGraph: {
    siteName: "Soonlist",
    title: "Create, collect, curate & share events",
    description,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 800,
        height: 400,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <PHProvider>
        <body>
          <PostHogPageView />
          <TRPCReactProvider cookies={cookies().toString()}>
            <Providers>{children}</Providers>
          </TRPCReactProvider>
        </body>
      </PHProvider>
    </html>
  );
}
