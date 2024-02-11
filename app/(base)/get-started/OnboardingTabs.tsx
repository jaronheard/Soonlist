"use client";

import { Instagram, Mail, Phone } from "lucide-react";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                className="h-[200px] min-h-[200px] resize-none"
                id="bio"
                placeholder="Enter your bio (max 150 characters)"
              />
              <CardDescription>
                Example: I love ambient music, creative community building, and
                vegan pop-ups.
              </CardDescription>
            </div>
            <div>
              <Card className="space-y-4">
                <CardHeader>
                  <CardTitle>How to connect</CardTitle>
                  <CardDescription>
                    Share any contact info you want to make public.
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      <tr className="">
                        <td className="p-2">
                          <Mail className="mr-2 inline-block size-4" />
                          Email
                        </td>
                        <td className="p-2">
                          <Input placeholder="email@example.com" />
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-2">
                          <Phone className="mr-2 inline-block size-4" />
                          Phone
                        </td>
                        <td className="p-2">
                          <Input placeholder="1234567890" />
                        </td>
                      </tr>
                      <tr className="">
                        <td className="p-2">
                          <Instagram className="mr-2 inline-block size-4" />
                          Insta
                        </td>
                        <td className="p-2">
                          <Input placeholder="@username" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="ml-auto"
              size="sm"
              onClick={() => {
                scrollTo(0, 0);
                handleTabChange("setup");
              }}
            >
              Next
            </Button>
          </CardFooter>
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
