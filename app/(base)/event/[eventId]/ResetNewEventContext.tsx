"use client";

import { useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCroppedImageContext } from "@/context/CroppedImageContext";
import { ModeContext, Mode, Status } from "@/context/ModeContext";
import { useNewEventContext } from "@/context/NewEventContext";

export default function ResetNewEventContext() {
  const pathName = usePathname();
  const { setCroppedImagesUrls } = useCroppedImageContext();
  const { setOrganizeData, setEventData } = useNewEventContext();
  const { setStatus, setMode } = useContext(ModeContext);

  useEffect(() => {
    setCroppedImagesUrls({});
    setOrganizeData({
      notes: "",
      visibility: "public",
      lists: [],
    });
    setEventData(undefined);
    setMode(Mode.View);
    setStatus(Status.Organize);
  }, [
    pathName,
    setCroppedImagesUrls,
    setOrganizeData,
    setEventData,
    setMode,
    setStatus,
  ]);

  return null;
}
