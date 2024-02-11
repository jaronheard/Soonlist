"use client";

import { Instagram, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ProgressIcon } from "./page";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function OnboardingTabs() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs
      className="w-full max-w-3xl"
      defaultValue="profile"
      value={activeTab}
      onValueChange={handleTabChange}
    >
      <TabsList className="grid grid-cols-2">
        <TabsTrigger className="relative" value="profile">
          <ProgressIcon status="complete"></ProgressIcon>
          <span className="block text-sm font-medium">Profile</span>
        </TabsTrigger>
        <TabsTrigger className="relative" value="setup">
          <ProgressIcon status="active"></ProgressIcon>
          <span className="block text-sm font-medium">Get Started</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card className="w-full max-w-3xl">
          <CardHeader className="space-y-1">
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Tell people about yourself and how to connect!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <UserProfileForm
              onSubmitSuccess={() => {
                scrollTo(0, 0);
                handleTabChange("setup");
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="setup">
        <Card className="w-full max-w-3xl">
          <CardHeader className="space-y-1">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Install the shortcut and start creating events!
            </CardDescription>
          </CardHeader>
          <CardContent className="prose space-y-6">
            <ol>
              <li>
                <p className="font-bold">Ensure your device is up to date</p>
                <p>
                  To use the iOS/MacOS Shortcut, you must have the latest major
                  version of{" "}
                  <a
                    href="https://support.apple.com/en-us/HT201685"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    iOS (&gt;17)
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://support.apple.com/en-us/109033"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MacOS (&gt;14)
                  </a>{" "}
                  installed.
                </p>
              </li>
              <li>
                <p className="font-bold">Install the iOS/MacOS Shortcut</p>
                <Button asChild size={"sm"} variant={"secondary"}>
                  <a
                    href="https://www.icloud.com/shortcuts/a44e63d78fd44a08b22dcaaea2bfa7f6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    Download shortcut
                  </a>
                </Button>
              </li>
              <li>
                <p className="font-bold">Test the iOS/MacOS Shortcut</p>
                <Button size="sm" asChild>
                  <a
                    href="shortcuts://run-shortcut?name=Add%20to%20Soonlist&input=Soonlist%20launch%20party%20on%20at%20the%20School%20of%20Art%20and%20Time%203340%20SE%20Morrison%20on%20Saturday%20February%2017%20from%206pm%20to%209pm%20Text%20Jaron%20at%209719987180%20for%20access%20instructions"
                    className="no-underline"
                  >
                    Test shortcut
                  </a>
                </Button>
                <p>This will create your first Soonlist event!</p>
              </li>
            </ol>
            <p>
              If you are encountering any issues, please send us a message via
              the chat widget.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

const userAdditionalInfoSchema = z.object({
  bio: z.string().max(150, "Bio must be 150 characters or less").optional(),
  publicEmail: z.string().email("Enter a valid email address").optional(),
  publicPhone: z
    .string()
    .max(20, "Phone number must be 20 digits or less")
    .optional(),
  publicInsta: z
    .string()
    .max(31, "Instagram username must be 31 characters or less")
    .optional(),
});

export default function UserProfileForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(userAdditionalInfoSchema),
  });

  function onSubmit(values: z.infer<typeof userAdditionalInfoSchema>) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      </pre>
    );
    onSubmitSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your bio (max 150 characters)"
                    className="h-[200px] min-h-[200px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Example: I love ambient music, creative community building,
                  and vegan pop-ups.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Card className="my-4">
          <CardHeader>
            <CardTitle>How to connect</CardTitle>
            <CardDescription>
              Share any contact info you want to make public.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="publicEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publicPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publicInsta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insta</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}
