"use client";

import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { ModeContext } from "@/context/ModeContext";

export function NewEventFooterButtons() {
  const { mode, setMode } = useContext(ModeContext);
  const otherMode = mode === "view" ? "edit" : "view";

  return (
    <footer className="fixed inset-x-0 bottom-0 flex items-center justify-center gap-4 p-4">
      <Button size="lg">Continue</Button>
      {/* Edit button is a link that adds a query parameter to the URL */}
      <Button size="lg" variant="secondary" onClick={() => setMode(otherMode)}>
        {mode === "view" ? "Edit" : "View"}
      </Button>
    </footer>
  );
}
