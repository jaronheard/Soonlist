"use client";

import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Mode, ModeContext, Status } from "@/context/ModeContext";
import { useFormContext } from "@/context/FormContext";
import { SaveButton } from "@/components/SaveButton";

export function NewEventFooterButtons({
  onClickNextOrganize,
  onClickNextPublish,
}: {
  onClickNextOrganize?: () => void;
  onClickNextPublish?: () => void;
}) {
  const { mode, setMode, status } = useContext(ModeContext);
  const { formData, eventData } = useFormContext();
  const otherMode = mode === Mode.Edit ? Mode.View : Mode.Edit;

  return (
    <footer className="fixed inset-x-0 bottom-0 flex items-center justify-center gap-4 p-4">
      {status === Status.Preview && (
        <>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setMode(otherMode)}
            className="capitalize"
          >
            {otherMode}
          </Button>
          {eventData && (
            <SaveButton
              event={eventData}
              notes={formData.notes}
              visibility={formData.visibility}
              lists={formData.lists}
            />
          )}
        </>
      )}
      {status === Status.Organize && (
        <Button size="lg" onClick={onClickNextOrganize}>
          Next
        </Button>
      )}
    </footer>
  );
}
