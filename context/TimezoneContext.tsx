"use client";

import React, { useState, createContext, ReactNode } from "react";
import { ITimezone } from "react-timezone-select";

// Create a Context for the timezone
export const TimezoneContext = createContext({
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as ITimezone,
  setTimezone: (timezone: ITimezone) => {},
});

// Provider component
export const TimezoneProvider = ({ children }: { children: ReactNode }) => {
  const [timezone, setTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
};
