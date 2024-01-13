"use client";

import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useChat } from "ai/react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, Share, Sparkles } from "lucide-react";
import { List } from "@prisma/client";
import { YourDetails } from "./new/YourDetails";
import ImageUpload from "./new/ImageUpload";
import { UploadButton } from "./new/UploadButton";
import { Form } from "@/components/Form";
import { Output } from "@/components/Output";
import { cn, generatedIcsArrayToEvents, getLastMessages } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddToCalendarCardSkeleton } from "@/components/AddToCalendarCardSkeleton";
import { TimezoneContext } from "@/context/TimezoneContext";

function Code({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
    >
      {children}
    </code>
  );
}

export default function AddEvent({ lists }: { lists?: List[] }) {
  // State variables
  const [finished, setFinished] = useState(false);
  const [events, setEvents] = useState<AddToCalendarButtonType[] | null>(null);
  const [trackedAddToCalendarGoal, setTrackedAddToCalendarGoal] =
    useState(false);

  // Context variables
  const { timezone } = useContext(TimezoneContext);

  // Custom hooks and utility functions
  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    messages,
  } = useChat({
    body: {
      source: "text",
      timezone,
    },
    onFinish(message) {
      setFinished(true);
    },
  });

  const { lastUserMessage, lastAssistantMessage } = getLastMessages(messages);

  // Event handlers
  const onSubmit = (e: any) => {
    setFinished(false);
    setTrackedAddToCalendarGoal(false);
    handleSubmit(e);
  };

  // Effects
  useEffect(() => {
    if (finished) {
      const events = generatedIcsArrayToEvents(lastAssistantMessage);
      setEvents(events);
      if (events.length === 0) {
        toast.error(
          "Something went wrong. Add you event manually or try again."
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-[60vh] ">
      <Tabs defaultValue="text" className="max-w-screen sm:max-w-xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">
            <Sparkles className="mr-2 h-4 w-4" />
            Image/Text
          </TabsTrigger>
          <TabsTrigger value="shortcut">
            <Sparkles className="mr-2 h-4 w-4" />
            Shortcut
          </TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Image/Text</CardTitle>
              <CardDescription>
                Add an event from image or an text. We&apos;ll use a little AI
                to figure out the details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadButton />
              <div className="p-4"></div>
              <Form
                handleInputChange={handleInputChange}
                input={input}
                isLoading={isLoading}
                onSubmit={onSubmit}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shortcut">
          <Card>
            <CardHeader>
              <CardTitle>Shortcut</CardTitle>
              <CardDescription>
                Add an event from the share menu on iOS or Mac. We&apos;ll use a
                little AI to figure out the details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a
                  href="https://www.icloud.com/shortcuts/a44e63d78fd44a08b22dcaaea2bfa7f6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Install Soonlist shortcut
                </a>
              </Button>
              <div className="p-3"></div>
              <ol className="flex list-outside list-disc flex-col gap-2">
                <li>
                  Click button above, then click the <Code>Get Shortcut</Code>{" "}
                  button to add it to your devices.
                </li>
                <li>
                  Use{" "}
                  <Code>
                    <Share className="inline-block h-4 w-4" /> Share
                  </Code>{" "}
                  on any screenshot, photo, or text.
                </li>
                <li>
                  Scroll down to select <Code>Add to Soonlist</Code>.
                </li>
                <li>
                  Click <Code>Always Allow</Code> when prompted for permissions.
                </li>
                <li>
                  Choose <Code>Add to Soonlist</Code> from the share options.
                </li>
                <li>
                  Edit the event draft and tap <Code>Save</Code>.
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <CardDescription className="italic">
                *Requires up-to-date software (iOS 17+/macOS 14+)
              </CardDescription>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Text</CardTitle>
              <CardDescription>
                Add an event manually by filling out a form.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Output events={[]} finished={true} setEvents={setEvents} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="p-4"></div>
      <YourDetails lists={lists || undefined} />
      <div className="p-4"></div>
      <ImageUpload />
      <div className="p-4"></div>
      {isLoading && <AddToCalendarCardSkeleton />}
      <Output events={events} finished={finished} setEvents={setEvents} />
    </div>
  );
}
