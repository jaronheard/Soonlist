import { currentUser } from "@clerk/nextjs";
import { OnboardingTabs } from "./OnboardingTabs";
import { api } from "@/trpc/server";
import logger from "@/lib/logger";

export const metadata = {
  title: "Get Started | Soonlist",
  openGraph: {
    title: "Get Started | Soonlist",
  },
};

// TODO: this page needs an overhaul. Also a lot of the content is duplicated on the about page

export default async function Page() {
  const activeUser = await currentUser();
  if (!activeUser) {
    logger.error("No currentUser found in get-started/page.tsx");
    return null;
  }
  const user = await api.user.getByUsername.query({
    userName: activeUser.username || "",
  });
  if (!user) {
    logger.error("No user found in get-started/page.tsx");
    return null;
  }

  return (
    <OnboardingTabs
      additionalInfo={{
        bio: user?.bio || undefined,
        publicEmail: user?.publicEmail || undefined,
        publicPhone: user?.publicPhone || undefined,
        publicInsta: user?.publicInsta || undefined,
        publicWebsite: user?.publicWebsite || undefined,
      }}
    />
  );
}
