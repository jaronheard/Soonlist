"use client";
import { UploadButton } from "@bytescale/upload-widget-react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
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
    <UploadButton
      options={widgetOptions}
      onComplete={(files) => {
        if (files.length > 0) {
          const filePath = files[0]?.filePath;
          if (filePath) {
            router.push(`/new?filePath=${filePath}&timezone=${timezone}`);
          }
        }
      }}
    >
      {({ onClick }) => (
        <Button className="w-full" onClick={onClick}>
          <ImageIcon className="mr-2 size-4" /> Upload Image
        </Button>
      )}
    </UploadButton>
  );
};
