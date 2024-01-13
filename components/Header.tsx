"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { TimezoneSelect } from "./TimezoneSelect";
import { cn } from "@/lib/utils";

const newEvent: { title: string; href: string; description: string }[] = [
  {
    title: "New Event",
    href: "/new",
    description: "Add a new event",
  },
];
const userEvents: { title: string; href: string; description: string }[] = [
  {
    title: "My Events",
    href: "/events",
    description: "All events you have added or saved",
  },
  {
    title: "Following",
    href: "/following",
    description: "All events from users or lists you are following",
  },
];

const allEvents: { title: string; href: string; description: string }[] = [
  {
    title: "All Events",
    href: "/events",
    description: "All events from all users",
  },
];
const allLists: { title: string; href: string; description: string }[] = [
  {
    title: "All Lists",
    href: "/lists",
    description: "All lists you have created",
  },
];
const userLists: { title: string; href: string; description: string }[] = [
  {
    title: "My Lists",
    href: "/lists",
    description: "All lists you have created",
  },
];
const userFollowing: { title: string; href: string; description: string }[] = [
  {
    title: "Following",
    href: "/following/users",
    description: "Users you are following",
  },
];
const allUsers: { title: string; href: string; description: string }[] = [
  {
    title: "All Users",
    href: "/users",
    description: "All users",
  },
];

export default function Header() {
  return (
    <header className="mt-3 flex w-full items-center justify-between px-2 pb-4 sm:mt-5 sm:px-4 sm:pb-7">
      <div className="flex items-center justify-between gap-2 sm:grow sm:gap-0">
        <NavigationMenu>
          <Link href="/" className="relative flex items-center space-x-3">
            <Calendar className="h-8 w-8" />
            <h1 className="ml-2 hidden text-2xl font-bold tracking-tight sm:block sm:text-4xl">
              Soonlist
            </h1>
            <Badge
              variant="secondary"
              className="absolute -bottom-2 left-[-1.9rem] scale-50 sm:static sm:scale-100"
            >
              Preview
            </Badge>
          </Link>
        </NavigationMenu>
      </div>
      <div className="flex gap-2">
        <Nav />
        <NavigationMenu>
          <SignedIn>
            <UserMenu />
          </SignedIn>
          <SignedOut>
            <SignInButton afterSignUpUrl="/onboarding">
              <button className={navigationMenuTriggerStyle()}>Sign In</button>
            </SignInButton>
          </SignedOut>
        </NavigationMenu>
      </div>
    </header>
  );
}

export function Nav() {
  const { user } = useUser();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Events</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 sm:w-[400px]">
              {newEvent.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
              <Separator />
              <SignedIn>
                {userEvents.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={`/${user?.username}${component.href}`}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </SignedIn>
              {allEvents.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Users</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 sm:w-[400px]">
              <SignedIn>
                {userFollowing.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={`/${user?.username}${component.href}`}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </SignedIn>
              {allUsers.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/onboarding" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItemSimple = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <NavigationMenuItem>
      <Link href="href" legacyBehavior passHref className={className} ref={ref}>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          {title}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
});
ListItemSimple.displayName = "ListItemSimple";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href!}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const UserMenu = () => {
  // Grab the `isLoaded` and `user` from useUser()
  const { isLoaded, user } = useUser();
  // Grab the signOut and openUserProfile methods
  const { signOut, openUserProfile } = useClerk();
  // Get access to Next's router
  const router = useRouter();

  // Make sure that the useUser() hook has loaded
  if (!isLoaded) return null;
  // Make sure there is valid user data
  if (!user?.id) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          alt={user?.primaryEmailAddress?.emailAddress!}
          src={user?.imageUrl}
          width={30}
          height={30}
          className="mr-2 rounded-full border border-gray-200 drop-shadow-sm"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openUserProfile()}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Timezone</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <TimezoneSelect />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
