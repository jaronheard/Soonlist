"use client";
import React, { useState } from "react";
import { Text } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { SaveButton } from "./SaveButton";
import { UpdateButton } from "./UpdateButton";
import { Label } from "./ui/label";
import { Input, InputDescription } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardTitle } from "./ui/card";
import { TimezoneSelect } from "./TimezoneSelect";
import { CalendarButton } from "./CalendarButton";
import { useCroppedImageContext } from "@/context/CroppedImageContext";
import { useFormContext } from "@/context/FormContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AddToCalendarCardProps } from "./AddToCalendarCard";

export function AddToCalendarCard({
  firstInputRef,
  ...initialProps
}: AddToCalendarCardProps) {
  // get croppedImagesUrls from context
  const { user } = useUser();
  const { croppedImagesUrls } = useCroppedImageContext();
  const { formData } = useFormContext();
  const { notes, visibility, lists } = formData;

  // TODO: only use croppedImagesUrls if query param is set and same image
  const hasFilePath = croppedImagesUrls.filePath;
  const matchesFilePath = true;
  const hasAllAspectRatios =
    croppedImagesUrls.cropped &&
    croppedImagesUrls.square &&
    croppedImagesUrls.fourThree &&
    croppedImagesUrls.sixteenNine;
  const validImagesFromContext =
    hasFilePath && matchesFilePath && hasAllAspectRatios;

  const imagesFromContext = validImagesFromContext
    ? [
        croppedImagesUrls.square!,
        croppedImagesUrls.fourThree!,
        croppedImagesUrls.sixteenNine!,
        croppedImagesUrls.cropped!,
      ]
    : undefined;

  const removeImage = croppedImagesUrls.deleted;
  // use images from context or initial props
  const images = removeImage ? [] : imagesFromContext || initialProps.images;

  // state
  const [name, setName] = useState(initialProps.name);
  const [location, setLocation] = useState(initialProps.location);
  const [description, setDescription] = useState(initialProps.description);
  const [startDate, setStartDate] = useState(initialProps.startDate);
  const [startTime, setStartTime] = useState(initialProps.startTime);
  const [endDate, setEndDate] = useState(initialProps.endDate);
  const [endTime, setEndTime] = useState(initialProps.endTime);
  const [timeZone, setTimeZone] = useState(
    initialProps.timeZone || "America/Los_Angeles"
  );
  const [link, setLink] = useState("");
  const [mentions, setMentions] = useState(
    initialProps?.metadata?.mentions || []
  );
  const [source, setSource] = useState(initialProps?.metadata?.source || []);
  const [price, setPrice] = useState(initialProps?.metadata?.price || 0);
  const [priceType, setPriceType] = useState(
    initialProps.metadata?.priceType || "unknown"
  );
  const [ageRestriction, setAgeRestriction] = useState(
    initialProps.metadata?.ageRestriction || "none"
  );
  const [category, setCategory] = useState(
    initialProps?.metadata?.category || []
  );
  const [type, setType] = useState(initialProps?.metadata?.type || "event");
  const [performers, setPerformers] = useState(
    initialProps?.metadata?.performers || []
  );

  const { listStyle, ...filteredProps } = initialProps;
  const acceptableListStyle = ["overlay", "modal"].includes(listStyle || "")
    ? listStyle
    : undefined;

  const updatedProps = {
    ...filteredProps,
    acceptableListStyle,
    name,
    location,
    description: link
      ? description + "[br][br]" + `[url]${link}|More Info[/url]`
      : description,
    startDate,
    startTime,
    endDate,
    endTime,
    timeZone,
    images,
    metadata: {
      mentions,
      source,
      price,
      priceType,
      ageRestriction,
      category,
      type,
      performers,
    },
  };

  console.log("updatedProps", updatedProps);

  return (
    <Card className="max-w-screen sm:max-w-xl">
      <CardContent className="grid grid-cols-1 gap-6 rounded-md py-6 shadow-md sm:grid-cols-6">
        <CardTitle className="col-span-full flex items-center justify-between">
          <div className="flex items-center">
            <Text className="mr-2 size-6" />
            Event Details
          </div>
        </CardTitle>
        <div className="col-span-full">
          <Label htmlFor="name">Event</Label>
          <Input
            type="text"
            name="name"
            id="name"
            className="font-bold"
            value={name}
            onChange={(e) => setName(e.target.value)}
            ref={firstInputRef}
          />
        </div>
        <div className="col-span-full">
          <Label htmlFor="startDate">Start Date</Label>
          <div>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="time"
              name="startTime"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="endDate">End Date</Label>
          <div>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              type="time"
              name="endTime"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="startDate">Time Zone</Label>
          <div>
            <TimezoneSelect
              timezone={timeZone}
              setTimezone={setTimeZone}
              fullWidth
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="location">Location</Label>
          <Input
            type="text"
            name="location"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-span-full">
          <Label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="p-0.5"></div>
          <InputDescription>
            Uses html psuedocode for formatting. [br] = line break,
            [url]link|link.com[/url] = link.{" "}
            <a
              href="https://add-to-calendar-button.com/configuration#:~:text=for%20Microsoft%20services.-,description,-String"
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 underline"
            >
              More info
            </a>
          </InputDescription>
        </div>
        <div className="col-span-full">
          <Card className="w-full max-w-lg">
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mentions">Mentions</Label>
                <Input id="mentions" placeholder="e.g. @shad, @vercel" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source">Source</Label>
                <Select defaultValue="Instagram" id="source">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Instagram" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" placeholder="e.g. Concert, Festival" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" placeholder="Enter price" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price-type">Price Type</Label>
                <Select defaultValue="Free" id="price-type">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Free" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Not A Flof">Not A Flof</SelectItem>
                    <SelectItem value="Donation">Donation</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age-restriction">Age Restriction</Label>
                <Select defaultValue="All Ages" id="age-restriction">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Ages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Ages">All Ages</SelectItem>
                    <SelectItem value="18+">18+</SelectItem>
                    <SelectItem value="21+">21+</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue="Music" id="category">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Music" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                    <SelectItem value="Arts & Culture">
                      Arts & Culture
                    </SelectItem>
                    <SelectItem value="Health & Wellness">
                      Health & Wellness
                    </SelectItem>
                    <SelectItem value="Community">Community</SelectItem>
                    <SelectItem value="Science & Tech">
                      Science & Tech
                    </SelectItem>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Charity & Causes">
                      Charity & Causes
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select id="event-type" multiple>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Virtual">Virtual</SelectItem>
                    <SelectItem value="In Person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="performers">Performers</Label>
                <Input
                  id="performers"
                  placeholder="e.g. @sza, @tylerthecreator"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-full">
          <Label htmlFor="location">Source Link (optional)</Label>
          <Input
            type="url"
            name="link"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          {!initialProps.update && (
            <SaveButton
              notes={notes}
              visibility={visibility}
              lists={lists}
              event={updatedProps}
            />
          )}
          {initialProps.update && (
            <UpdateButton
              id={initialProps.updateId!}
              notes={notes}
              visibility={visibility}
              lists={lists}
              event={updatedProps}
            />
          )}
          <CalendarButton
            event={updatedProps}
            id={initialProps.updateId || undefined}
            username={user?.username || undefined}
            type="button"
          />
        </div>
      </CardContent>
    </Card>
  );
}
