"use client";

import { useContext, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, PencilIcon } from "lucide-react";
import { Organize } from "./Organize";
import { NewEventFooterButtons } from "./NewEventFooterButtons";
import ImageCropperSmall from "./ImageCropperSmall";
import { ModeContext, Status } from "@/context/ModeContext";
import { type List } from "@/server/db/types";
import { useFormContext } from "@/context/FormContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [showCropActions, setShowCropActions] = useState(false);
  return (
    <div className="flex w-full flex-col items-center">
      {/* <YourDetails lists={lists || undefined} /> */}
      {/* <ImageUpload filePath={searchParams.filePath} /> */}
      <header className="fixed inset-x-0 top-2 flex items-center justify-center">
        {status !== Status.Organize && (
          <Button
            onClick={setPreviousStatus}
            className="absolute left-0 top-0"
            variant={"ghost"}
            size={"icon"}
          >
            <ChevronLeft />
          </Button>
        )}
        <button
          className={cn("relative origin-top", {
            "scale-50 hover:opacity-60": !showCropActions,
          })}
          onClick={() => {
            !showCropActions && setShowCropActions(true);
          }}
        >
          <ImageCropperSmall
            filePath={filePath}
            showActions={showCropActions}
            setShowActions={setShowCropActions}
          />
          {!showCropActions && (
            <div
              className={cn(
                buttonVariants({ size: "icon", variant: "secondary" }),
                "absolute -bottom-2 -right-2 scale-150 hover:bg-secondary"
              )}
            >
              <PencilIcon className="size-6" />
            </div>
          )}
        </button>
      </header>
      <div className="p-12"></div>
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
