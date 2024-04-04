"use client";
import { UploadDropzone } from "@bytescale/upload-widget-react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { TimezoneContext } from "@/context/TimezoneContext";
import { bytescaleWidgetOptions } from "@/components/ImageUpload";

const widgetOptions = { ...bytescaleWidgetOptions, showFinishButton: true };

export const UploadImageForProcessingButton = () => {
  const router = useRouter();
  const { timezone } = useContext(TimezoneContext);
  return (
    <UploadDropzone
      options={widgetOptions}
      onComplete={(files) => {
        if (files.length > 0) {
          const filePath = files[0]?.filePath;
          if (filePath) {
            router.push(`/new?filePath=${filePath}&timezone=${timezone}`);
          }
        }
      }}
    ></UploadDropzone>
  );
};
