"use client";

import React, { useState } from "react";
import { type AddToCalendarButtonType } from "add-to-calendar-button-react";
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

type AddToCalendarCardProps = AddToCalendarButtonType & {
  update?: boolean;
  updateId?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  firstInputRef?: React.RefObject<HTMLInputElement>;
  setAddToCalendarButtonProps?: (props: AddToCalendarButtonType) => void;
};

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
          {/* display metadata for testing in a pre */}
          Metadata
          <pre>{JSON.stringify(updatedProps?.metadata, null, 2)}</pre>
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
