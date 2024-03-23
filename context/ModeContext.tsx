/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, createContext, type ReactNode } from "react";

// Provider component
export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState("view");
  const [status, setStatus] = useState("preview");

  return (
    <ModeContext.Provider value={{ mode, setMode, status, setStatus }}>
      {children}
    </ModeContext.Provider>
  );
};

// Create a Context for the mode (edit or view)
export const ModeContext = createContext({
  mode: "view",
  setMode: (mode: string) => console.warn("no mode provider"),
  status: "preview",
  setStatus: (status: string) => console.warn("no status provider"),
});
