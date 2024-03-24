/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, createContext, type ReactNode } from "react";

export enum Mode {
  Edit = "edit",
  View = "view",
}

export enum Status {
  Organize = "organize",
  Preview = "preview",
  Publish = "publish",
}

// Provider component
export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState(Mode.View);
  const [status, setStatus] = useState(Status.Organize);

  function setNextStatus() {
    const allStatuses = Object.values(Status);
    const nextIndex = allStatuses.indexOf(status) + 1;
    if (nextIndex >= 0) {
      const previousStatus = allStatuses[nextIndex];
      previousStatus && setStatus(previousStatus);
    }
  }

  function setPreviousStatus() {
    const allStatuses = Object.values(Status);
    const prevIndex = allStatuses.indexOf(status) - 1;
    if (prevIndex >= 0) {
      const previousStatus = allStatuses[prevIndex];
      previousStatus && setStatus(previousStatus);
    }
  }

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        status,
        setStatus,
        setNextStatus,
        setPreviousStatus,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

// Create a Context for the mode (edit or view)
export const ModeContext = createContext({
  mode: Mode.View,
  setMode: (mode: Mode) => console.warn("no mode provider"),
  status: Status.Preview,
  setStatus: (status: Status) => console.warn("no status provider"),
  setNextStatus: () => console.warn("no status provider"),
  setPreviousStatus: () => console.warn("no status provider"),
});
