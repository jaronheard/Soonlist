"use client";

import { useContext } from "react";
import * as Bytescale from "@bytescale/sdk";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { Organize } from "./Organize";
import { NewEventFooterButtons } from "./NewEventFooterButtons";
import { ModeContext, Status } from "@/context/ModeContext";
import { type List } from "@/server/db/types";
import { useFormContext } from "@/context/FormContext";
import { Button } from "@/components/ui/button";

function ImagePreview({ filePath }: { filePath?: string }) {
  if (!filePath) return null;
  const croppedImageUrl = Bytescale.UrlBuilder.url({
    accountId: "12a1yek",
    filePath: filePath, // Ensure filePath is defined and contains the path to the image
    options: {
      transformation: "image",
      transformationParams: {
        w: 48,
        h: 48,
        fit: "min",
        q: 70,
        f: "jpg",
      },
    },
  });
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={croppedImageUrl}
      alt="Image preview"
      className="size-12 rounded-full object-cover"
    />
  );
}

function StagesWrapper({
  filePath,
  children,
  onClickNextOrganize,
}: {
  filePath?: string;
  children: JSX.Element;
  onClickNextOrganize?: () => void;
}) {
  const { status, setPreviousStatus } = useContext(ModeContext);
  return (
    <div className="flex w-full flex-col items-center">
      {/* <YourDetails lists={lists || undefined} /> */}
      {/* <ImageUpload filePath={searchParams.filePath} /> */}
      <header className="fixed inset-x-0 top-2 flex items-center justify-center">
        {status !== Status.Organize && (
          <Button
            onClick={setPreviousStatus}
            className="absolute left-2"
            variant={"ghost"}
            size={"icon"}
          >
            <ChevronLeft />
          </Button>
        )}
        <ImagePreview filePath={filePath} />
      </header>
      {children}
      <NewEventFooterButtons onClickNextOrganize={onClickNextOrganize} />
    </div>
  );
}

export const formSchema = z.object({
  notes: z.string().optional(),
  visibility: z.enum(["public", "private"]),
  lists: z.array(z.record(z.string().trim())),
});

export function Stages({
  filePath,
  lists,
  Preview,
}: {
  filePath?: string;
  lists?: List[];
  Preview: JSX.Element;
}) {
  const { status, setNextStatus } = useContext(ModeContext);
  const { formData, setFormData, eventData, setEventData } = useFormContext();
  const { notes, visibility, lists: eventLists } = formData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: notes || "",
      visibility: visibility || "public",
      lists: eventLists,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    setFormData(data);
    setNextStatus();
  };

  if (status === Status.Organize) {
    return (
      <StagesWrapper
        filePath={filePath}
        onClickNextOrganize={form.handleSubmit(onSubmit)}
      >
        <>
          <Organize lists={lists || []} form={form} />
          <div className="hidden">{Preview}</div>
        </>
      </StagesWrapper>
    );
  }

  if (status === Status.Preview) {
    return <StagesWrapper filePath={filePath}>{Preview}</StagesWrapper>;
  }

  if (status === Status.Publish) {
    return (
      <StagesWrapper filePath={filePath}>
        <>
          <>{JSON.stringify(eventData, null, 2)}</>
          <>{JSON.stringify(formData, null, 2)}</>
        </>
      </StagesWrapper>
    );
  }
}
