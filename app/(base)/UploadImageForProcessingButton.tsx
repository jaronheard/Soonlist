"use client";
import { UploadDropzone } from "@bytescale/upload-widget-react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { TimezoneContext } from "@/context/TimezoneContext";

const widgetOptions = {
  apiKey: "public_12a1yekATNiLj4VVnREZ8c7LM8V8",
  maxFileCount: 1,
  showFinishButton: true,
  styles: {
    colors: {
      primary: "#5A32FB",
    },
    fontFamilies: {
      base: "var(--font-plex-sans)",
    },
  },
  editor: {
    images: {
      crop: false,
      preview: false,
    },
  },
};

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
