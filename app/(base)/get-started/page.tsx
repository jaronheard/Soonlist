import { Instagram, Mail, Phone } from "lucide-react";
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
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

function Component() {
  return (
    <Tabs className="w-full max-w-3xl" defaultValue="profile">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger className="relative" value="profile">
          <span className="block text-sm font-medium">Profile</span>
          <span className="absolute left-1/2 top-0 -mt-3 size-3 -translate-x-1/2 rounded-full bg-gray-300" />
        </TabsTrigger>
        <TabsTrigger className="relative" value="list">
          <span className="block text-sm font-medium">List</span>
          <span className="absolute left-1/2 top-0 -mt-3 size-3 -translate-x-1/2 rounded-full bg-gray-300" />
        </TabsTrigger>
        <TabsTrigger className="relative" value="event">
          <span className="block text-sm font-medium">Event</span>
          <span className="absolute left-1/2 top-0 -mt-3 size-3 -translate-x-1/2 rounded-full bg-gray-300" />
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
            <Button className="ml-auto" size="sm">
              Next
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="list">
        <CardHeader className="space-y-1">
          <CardTitle>Your List</CardTitle>
          <CardDescription>
            Add your bio and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              className="h-[200px] min-h-[200px] resize-none"
              id="bio"
              placeholder="Enter your bio"
            />
          </div>
          <div>
            <Card className="space-y-4">
              <CardContent className="p-0">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <tr className="border-t">
                      <td className="border-l p-2">
                        <Mail className="mr-2 inline-block size-4" />
                        Email
                      </td>
                      <td className="border-l p-2">
                        <Input placeholder="Enter your email" />
                      </td>
                      <td className="border-l p-2">
                        <Toggle className="ml-auto" defaultChecked />
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="border-l p-2">
                        <Phone className="mr-2 inline-block size-4" />
                        Phone
                      </td>
                      <td className="border-l p-2">
                        <Input placeholder="Enter your phone" />
                      </td>
                      <td className="border-l p-2">
                        <Toggle className="ml-auto" defaultChecked />
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="border-l p-2">
                        <Instagram className="mr-2 inline-block size-4" />
                        Instagram
                      </td>
                      <td className="border-l p-2">
                        <Input placeholder="Enter your LinkedIn" />
                      </td>
                      <td className="border-l p-2">
                        <Toggle className="ml-auto" defaultChecked />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" size="sm">
            Next
          </Button>
        </CardFooter>
      </TabsContent>
      <TabsContent value="event">
        <CardHeader className="space-y-1">
          <CardTitle>Add your first event</CardTitle>
          <CardDescription>
            Add your bio and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              className="h-[200px] min-h-[200px] resize-none"
              id="bio"
              placeholder="Enter your bio"
            />
          </div>
          <div>
            <Card className="space-y-4">
              <CardContent className="p-0">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <tr className="border-t">
                      <td className="border-l p-2">
                        <Mail className="mr-2 inline-block size-4" />
                        Email
                      </td>
                      <td className="border-l p-2">
                        <Input placeholder="Enter your email" />
                      </td>
                      <td className="border-l p-2">
                        <Toggle className="ml-auto" defaultChecked />
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="border-l p-2">
                        <Phone className="mr-2 inline-block size-4" />
                        Phone
                      </td>
                      <td className="border-l p-2">
                        <Input placeholder="Enter your phone" />
                      </td>
                      <td className="border-l p-2">
                        <Toggle className="ml-auto" defaultChecked />
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="border-l p-2">
                        <Instagram className="mr-2 inline-block size-4" />
                        Instagram
                      </td>
                      <td className="border-l p-2">
                        <Input placeholder="Enter your LinkedIn" />
                      </td>
                      <td className="border-l p-2">
                        <Toggle className="ml-auto" defaultChecked />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" size="sm">
            Next
          </Button>
        </CardFooter>
      </TabsContent>
    </Tabs>
  );
}

export const metadata = {
  title: "Get Started | Soonlist",
  openGraph: {
    title: "Get Started | Soonlist",
  },
};

// TODO: this page needs an overhaul. Also a lot of the content is duplicated on the about page

export default function Page() {
  return <Component />;
}
