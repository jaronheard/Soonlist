"use client";

import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Mode, ModeContext, Status } from "@/context/ModeContext";

export function NewEventFooterButtons() {
  const { mode, setMode, status, setNextStatus, setPreviousStatus } =
    useContext(ModeContext);
  const otherMode = mode === Mode.Edit ? Mode.View : Mode.Edit;

  return (
    <footer className="fixed inset-x-0 bottom-0 flex items-center justify-center gap-4 p-4">
      {status === Status.Preview && (
        <Button
          size="lg"
          variant="secondary"
          onClick={() => setMode(otherMode)}
          className="capitalize"
        >
          {otherMode}
        </Button>
      )}
      {/* Back button only shown in Preview mode */}
      {status !== Status.Preview && (
        <Button size="lg" variant="secondary" onClick={setPreviousStatus}>
          Back
        </Button>
      )}
      <Button size="lg" onClick={setNextStatus}>
        Continue
      </Button>
    </footer>
  );
}
