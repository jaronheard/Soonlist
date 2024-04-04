"use client";
import { UploadDropzone } from "@bytescale/upload-widget-react";
import { useContext } from "react";
import { TimezoneContext } from "@/context/TimezoneContext";
import { bytescaleWidgetOptions } from "@/components/ImageUpload";

const widgetOptions = { ...bytescaleWidgetOptions };

export const UploadImageForProcessingButton = () => {
  const { timezone } = useContext(TimezoneContext);
  return (
    <UploadDropzone
      options={widgetOptions}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length > 0) {
          const filePath = uploadedFiles[0]?.filePath;
          if (filePath) {
            window.location.href = `/new?filePath=${filePath}&timezone=${timezone}`;
          }
        }
      }}
    ></UploadDropzone>
  );
};
