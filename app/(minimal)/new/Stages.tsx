"use client";

import { useContext } from "react";
import { ModeContext, Status } from "@/context/ModeContext";

export function Stages({
  Organize,
  Preview,
  Publish,
}: {
  Organize: JSX.Element;
  Preview: JSX.Element;
  Publish: JSX.Element;
}) {
  const { status } = useContext(ModeContext);

  if (status === Status.Publish) {
    return <>{Publish}</>;
  }
  if (status === Status.Preview) {
    return <>{Preview}</>;
  }

  if (status === Status.Organize) {
    return <>{Organize}</>;
  }
}
