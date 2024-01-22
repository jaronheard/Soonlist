"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { Settings } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { TimezoneSelect } from "./TimezoneSelect";
import { Button } from "./ui/button";
import Logo from "./Logo";
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
    description: "All events from lists you are following",
  },
];

const allEvents: { title: string; href: string; description: string }[] = [
  {
    title: "All Events",
    href: "/events",
    description: "All events from all users",
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
    <div className="sticky top-0 z-50 bg-interactive-3">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-2 pb-4 pt-3 sm:px-4 sm:pb-7 sm:pt-5">
        <div className="flex items-center justify-between gap-2 sm:grow sm:gap-0">
          <NavigationMenu>
            <Link href="/" className="relative flex items-center space-x-3">
              <Logo />
            </Link>
          </NavigationMenu>
        </div>
        <div className="flex gap-4">
          <Nav />
          <NavigationMenu>
            <SignedIn>
              <UserMenu />
            </SignedIn>
            <SignedOut>
              <SettingsMenu />
            </SignedOut>
          </NavigationMenu>
        </div>
      </header>
    </div>
  );
}

export function Nav() {
  const { user } = useUser();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <SignedIn>
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
        </SignedIn>
        <SignedIn>
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
        </SignedIn>
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
>(({ className, title }, ref) => {
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

  // if not loaded return a 32x32 grey circle pulsing
  if (!isLoaded || !user?.id) {
    return (
      <div className="size-8 animate-pulse rounded-full bg-gray-100 p-1"></div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          alt={"User"}
          src={user?.imageUrl}
          width={32}
          height={32}
          className="rounded-full border border-gray-200 drop-shadow-sm"
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

const SettingsMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Settings className="size-8 rounded-full bg-black p-1 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Timezone</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <TimezoneSelect />
        <DropdownMenuSeparator />
        <SignInButton afterSignUpUrl="/onboarding">
          <DropdownMenuItem>
            <Button variant="secondary" className="w-full">
              Log In
            </Button>
          </DropdownMenuItem>
        </SignInButton>
        {/* <SignUpButton afterSignUpUrl="/onboarding">
          <DropdownMenuItem>
            <Button className="w-full">🌈 Sign Up</Button>
          </DropdownMenuItem>
        </SignUpButton> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
