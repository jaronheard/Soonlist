"use client";

import { useContext } from "react";
import { Organize } from "./Organize";
import { ModeContext, Status } from "@/context/ModeContext";
import { type List } from "@/server/db/types";

export function Stages({
  lists,
  Preview,
}: {
  lists?: List[];
  Preview: JSX.Element;
}) {
  const { status } = useContext(ModeContext);

  if (status === Status.Publish) {
    return <>Publish</>;
  }
  if (status === Status.Preview) {
    return <>{Preview}</>;
  }

  if (status === Status.Organize) {
    return <>{<Organize lists={lists || []} />}</>;
  }
}
