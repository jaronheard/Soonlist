"use client";

import { useContext } from "react";
import { ModeContext, Status } from "@/context/ModeContext";

export function Stages({ children }: { children: React.ReactNode }) {
  const { status } = useContext(ModeContext);

  if (status === Status.Publish) {
    return <>Publish: final step</>;
  }
  if (status === Status.Organize) {
    return <>{children}</>;
  }

  return <>First step: preview</>;
}
