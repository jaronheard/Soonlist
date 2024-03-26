"use client";

import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { ChevronLeft, PencilIcon } from "lucide-react";
import { Organize } from "./Organize";
import { NewEventFooterButtons } from "./NewEventFooterButtons";
import ImageCropperSmall from "./ImageCropperSmall";
import { organizeFormSchema } from "./YourDetails";
import {
  Status,
  useNewEventProgressContext,
} from "@/context/NewEventProgressContext";
import { type List } from "@/server/db/types";
import { useNewEventContext } from "@/context/NewEventContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ProgressStagesWrapper({
  filePath,
  children,
  onClickNextOrganize,
}: {
  filePath?: string;
  children: JSX.Element;
  onClickNextOrganize?: () => void;
}) {
  const { status, goToPreviousStatus } = useNewEventProgressContext();
  const [showCropActions, setShowCropActions] = useState(false);
  return (
    <div className="flex w-full flex-col items-center">
      {/* <YourDetails lists={lists || undefined} /> */}
      {/* <ImageUpload filePath={searchParams.filePath} /> */}
      <header className="fixed inset-x-0 top-2 flex items-center justify-center">
        {status !== Status.Organize && (
          <Button
            onClick={goToPreviousStatus}
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

export function ProgressStages({
  filePath,
  lists,
  Preview,
}: {
  filePath?: string;
  lists?: List[];
  Preview: JSX.Element;
}) {
  const { status, goToNextStatus } = useNewEventProgressContext();
  const { organizeData, setOrganizeData, eventData } = useNewEventContext();
  const { notes, visibility, lists: eventLists } = organizeData;

  const form = useForm<z.infer<typeof organizeFormSchema>>({
    resolver: zodResolver(organizeFormSchema),
    defaultValues: {
      notes: notes || "",
      visibility: visibility || "public",
      lists: eventLists,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof organizeFormSchema>> = (
    data
  ) => {
    setOrganizeData(data);
    goToNextStatus();
  };

  if (status === Status.Organize) {
    return (
      <ProgressStagesWrapper
        filePath={filePath}
        onClickNextOrganize={form.handleSubmit(onSubmit)}
      >
        <>
          <Organize lists={lists || []} form={form} />
          {/* This ensures that the event starts being processed by the LLM immediately */}
          <div className="hidden">{Preview}</div>
        </>
      </ProgressStagesWrapper>
    );
  }

  if (status === Status.Preview) {
    return (
      <ProgressStagesWrapper filePath={filePath}>
        {Preview}
      </ProgressStagesWrapper>
    );
  }

  if (status === Status.Publish) {
    return (
      <ProgressStagesWrapper filePath={filePath}>
        <>
          <>{JSON.stringify(eventData, null, 2)}</>
          <>{JSON.stringify(organizeData, null, 2)}</>
        </>
      </ProgressStagesWrapper>
    );
  }
}
