import { Suspense } from "react";
import {
  ArrowRight,
  Calendar,
  CalendarPlus,
  Link,
  List,
  Megaphone,
  Share,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import makingEarthCool from "@/assets/making-earth-cool.jpeg";
import SampleEvent from "@/components/SampleEvent";
import SampleList from "@/components/SampleList";
import SampleListPhotos from "@/components/SampleListPhotos";
import { CTAButton } from "@/components/CallToActions";
import { Button } from "@/components/ui/button";

const features = [
  {
    name: "Find & Add Events",
    description:
      "Discover events from other curators or add your own in just a few clicks. AI simplifies the process, making event curation quick and easy.",
    href: "#",
    icon: CalendarPlus,
  },
  {
    name: "Curate Event Lists",
    description:
      "Organize events into useful, shareable lists. Follow others curators for an event feed personalized to  your interests and the communities you care about.",
    href: "#",
    icon: List,
  },
  {
    name: "Share & Sync",
    description:
      "Easily share events and lists with others via a simple web link anyone can use. Add events or lists to your personal calendar with a click.",
    href: "#",
    icon: Share,
  },
];

const advancedFeatures = [
  {
    name: "Community First",
    description:
      "Be part of a community where value is shared, from our business model to financially supporting curators.",
    icon: Users,
  },
  {
    name: "Curator Empowerment",
    description:
      "Elevate, recognize, and value curators with tools that amplify their contributions to communities.",
    icon: Megaphone,
  },
  {
    name: "Instant Connection",
    description:
      "Leverage AI to swiftly create and share events, and get back to getting together faster.",
    icon: Zap,
  },
];

const featuredTestimonial = {
  body: "As an organizer of dance parties and environmental justice activist, I've been dreaming of making event lists this easy for years!",
  author: {
    name: "Sarah Baker",
    handle: "boogiebuffet",
    imageUrl:
      "https://www.soonlist.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWEJKQ0oxZDdVc05BcW9tUHhielljR0t0QmQifQ&w=750&q=75",
    logoUrl: makingEarthCool.src,
  },
};
const testimonials = [
  [
    [
      {
        body: "The commitment to community and collective growth is evident, and I'm here for it.",
        author: {
          name: "jennifer batchelor",
          handle: "jennybatch",
          imageUrl:
            "https://www.soonlist.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWE45MmZWcW5PdUE2T0VCalVBMVRRM3ViaEMifQ&w=750&q=75",
        },
      },
    ],
    [
      {
        body: "Screenshotting an Instagram story and turning it into a calendar event on the open web in seconds feels like getting away with something!",
        author: {
          name: "Jaron Heard",
          handle: "jaronheard",
          imageUrl:
            "https://www.soonlist.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWERpc3hISWJyWkZFOUFJV3VrZ21vRkJNcnAifQ&w=750&q=75",
        },
      },
      // More testimonials...
    ],
  ],
  [
    // [
    //   {
    //     body: "The personal calendar sync feature is brilliant – it keeps me organized and connected with my community's activities.",
    //     author: {
    //       name: "Josh Carr",
    //       handle: "joshcarr",
    //       imageUrl:
    //         "https://www.soonlist.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWEJJUDFzTW9JWmN4eURvU3JISERnTDFpbTQifQ&w=750&q=75",
    //     },
    //   },
    //   // More testimonials...
    // ],
    // [
    //   {
    //     body: "Even in these early stages, the vision for how this can benefit communities is clear and it's exciting to be part of.",
    //     author: {
    //       name: "Jenny M Ng",
    //       handle: "jenny",
    //       imageUrl:
    //         "https://www.soonlist.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWHJ6Smw3NWE3ckVUY0F5R2tjWW5lTWdteTkifQ&w=750&q=75",
    //     },
    //   },
    //   // More testimonials...
    // ],
  ],
];

const sampleEventId =
  process.env.NODE_ENV === "production"
    ? "clrh2zo6p0001asmk0axrq55h"
    : "clrg63xn20001zyzg6gnwzktg";
const sampleEventListId = "cloetmfc60001jr0ays7hsxum";

function EventDetails({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="text-xs text-gray-500">
        7:30PM - 11:00PM // Turn Turn Turn
      </div>
      <div className="mt-1 text-lg font-semibold">
        Dance Parpy: Sweat Out 2023
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Let go! The entry fee ranges from $5 to $10. Arrive by 8:15 to be
        entered into a vinyl raffle where the top prize is $88 Mississippi...
      </p>
      <div className="flex w-full justify-between text-interactive-1">
        <div className="mt-4 inline-flex items-center text-sm font-medium">
          Learn more
          <ArrowRight className="ml-1 size-4 text-interactive-2" />
        </div>
        <div className="mt-4 flex space-x-2">
          <Calendar className="size-8 rounded-full bg-interactive-3 p-1.5 text-interactive-1" />
          <Share className="size-8 rounded-full bg-interactive-3 p-1.5 text-interactive-1" />
        </div>
      </div>
    </div>
  );
}

function MakeAndShareListsOfEvents() {
  return (
    <div className="rounded-xl border border-neutral-3 px-24 py-16 text-center">
      <div className="mx-auto max-w-2.5xl">
        <h1 className="font-heading text-5xl font-bold leading-[1.08333] tracking-tight text-gray-800">
          Make and share lists of events
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-2xl leading-9 text-gray-400">
          Easily discover, curate, and share events that bring us together. Join
          a network of passionate curators and participants building community
          around events that matter.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-8">
        <div>
          <h2 className="text-2.5xl font-bold leading-9 tracking-wide">
            Discover Events
          </h2>
          <div className="py-2"></div>
          <p className="mt-2 text-lg leading-7 text-gray-500">
            Discover events from other curators or add your own in just a few
            clicks.
          </p>
          <div className="flex space-x-2 px-5 pt-14">
            <Image
              src="https://upcdn.io/12a1yek/raw/uploads/Soonlist/events-collage.png"
              height={316}
              width={285}
              alt=""
              className="size-full"
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2.5xl font-bold leading-9 tracking-wide">
            Curate & Build
          </h2>
          <div className="py-2"></div>
          <p className="mt-2 text-lg leading-7 text-gray-500">
            Let AI do the work of uncovering dates, times, locations, and more.
          </p>
          <div className="flex space-x-2 px-5 pt-12">
            <div className="flex h-80 items-start justify-center rounded-full bg-interactive-3 text-base font-bold leading-5 text-interactive-1">
              <div className="">
                <Sparkles className="mx-auto mb-6 mt-4 size-12 rounded-full bg-interactive-2 p-1.5" />
                <div className="flex flex-col gap-2">
                  <div className="">JAN 17 WEDS</div>
                  <div className="">4:00PM - 5:00PM</div>
                  <div className="text-balance">
                    Dance Parpy: Sweat Out 2023 w/ PLNT DDJ
                  </div>
                  <p className="text-balance px-3.5 font-medium">
                    Let go! The entry fee ranges from $5 to $10. Arrive by 8:15
                    to be entered...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2.5xl font-bold leading-9 tracking-wide">
            Share & Sync
          </h2>
          <div className="py-2"></div>
          <p className="mt-2 text-lg leading-7 text-gray-500">
            Organize events into useful, shareable lists. Easily share events.
          </p>
          <div className="pt-16"></div>
          <div className="relative mt-5">
            <div className="absolute z-30 mr-5 rounded-lg border-[0.85px] border-neutral-3 bg-white p-4 text-left shadow-sm">
              <EventDetails />
            </div>
            <div className="absolute inset-x-2.5 top-2.5 z-20 rounded-lg border-[0.85px] border-neutral-3 bg-white p-4 text-left shadow-sm">
              <EventDetails className="opacity-0" />
            </div>
            <div className="absolute left-5 top-5 z-10 rounded-lg border-[0.85px] border-neutral-3 bg-white p-4 text-left shadow-sm">
              <EventDetails className="opacity-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="bg-white">
      <div className="relative isolate bg-interactive-3 px-6 pt-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-y-16 py-16 pb-48 sm:grid-cols-2 sm:gap-x-16 sm:pt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto">
              <h1 className="font-heading text-6xl font-bold leading-[0.875] tracking-tighterish text-gray-700 sm:text-8xl sm:leading-[0.875]">
                Event lists for{" "}
                <span className="text-interactive-1">everybody</span>
              </h1>
              <p className="mt-6 max-w-[30rem] text-2xl leading-9 text-gray-400">
                Gather and share events that matter to you and your communities
              </p>
            </div>
            <div className="mt-10 flex items-center gap-x-6">
              <CTAButton />
              <Button variant="link" asChild>
                <Link href="/explore">
                  Explore <span aria-hidden="true">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="isolate mx-auto -mt-24 max-w-7xl rounded-lg bg-white">
        <MakeAndShareListsOfEvents />
      </div>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Calendars as common ground
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Easily discover, curate, and share events that bring us together.
              Join a network of passionate curators and participants building
              community around events that matter.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon
                      className="size-5 flex-none text-gray-600"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
            <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
                <p className="font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Building togetherness
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  We&apos;re building an ecosystem that simplifies discovering,
                  sharing, and engaging with events. It&apos;s a space where
                  everyone has the power and tools to contribute to our shared
                  calendars and build community.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {advancedFeatures.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon
                          className="absolute left-1 top-1 size-5 text-gray-600"
                          aria-hidden="true"
                        />
                        {feature.name}.
                      </dt>{" "}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="sm:px-6 lg:px-0">
              <div className="relative isolate overflow-hidden bg-gradient-to-br from-green-500/10 via-blue-500/10 to-indigo-500/10 sm:mx-auto sm:max-w-2xl sm:rounded-3xl lg:max-w-none">
                <Image
                  src="https://upcdn.io/12a1yek/raw/uploads/2024/01/17/IMG_3960.png"
                  alt=""
                  height={1344}
                  width={1008}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1008px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative isolate bg-white pb-32 pt-24 sm:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              People are already excited
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
            <figure className="ring-gray-900/5 rounded-2xl bg-white shadow-lg ring-1 sm:col-span-2 xl:col-start-2 xl:row-end-1">
              <blockquote className="p-6 text-lg font-semibold leading-7 tracking-tight text-gray-900 sm:p-12 sm:text-xl sm:leading-8">
                <p>{`“${featuredTestimonial.body}”`}</p>
              </blockquote>
              <figcaption className="border-gray-900/10 flex flex-wrap items-center gap-4 border-t px-6 py-4 sm:flex-nowrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="size-10 flex-none rounded-full bg-gray-50"
                  src={featuredTestimonial.author.imageUrl}
                  alt=""
                />
                <div className="flex-auto">
                  <div className="font-semibold">
                    {featuredTestimonial.author.name}
                  </div>
                  <div className="text-gray-600">{`@${featuredTestimonial.author.handle}`}</div>
                </div>
                {/* <img
                  className="h-10 w-auto flex-none rounded-full"
                  src={featuredTestimonial.author.logoUrl}
                  alt=""
                /> */}
              </figcaption>
            </figure>
            {testimonials.map((columnGroup, columnGroupIdx) => (
              <div
                key={columnGroupIdx}
                className="space-y-8 xl:contents xl:space-y-0"
              >
                {columnGroup.map((column, columnIdx) => (
                  <div
                    key={columnIdx}
                    className={cn(
                      (columnGroupIdx === 0 && columnIdx === 0) ||
                        (columnGroupIdx === testimonials.length - 1 &&
                          columnIdx === columnGroup.length - 1)
                        ? "xl:row-span-2"
                        : "xl:row-start-1",
                      "space-y-8"
                    )}
                  >
                    {column.map((testimonial) => (
                      <figure
                        key={testimonial.author.handle}
                        className="ring-gray-900/5 rounded-2xl bg-white p-6 shadow-lg ring-1"
                      >
                        <blockquote className="text-gray-900">
                          <p>{`“${testimonial.body}”`}</p>
                        </blockquote>
                        <figcaption className="mt-6 flex items-center gap-x-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="size-10 rounded-full bg-gray-50"
                            src={testimonial.author.imageUrl}
                            alt=""
                          />
                          <div>
                            <div className="font-semibold">
                              {testimonial.author.name}
                            </div>
                            <div className="text-gray-600">{`@${testimonial.author.handle}`}</div>
                          </div>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
