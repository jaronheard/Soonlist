"use client";
import { UploadButton as BytescaleUploadButton } from "@bytescale/upload-widget-react";
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
      primary: "rgb(17, 24, 39)",
    },
  },
  editor: {
    images: {
      crop: false,
      preview: false,
    },
  },
};

export const UploadButton = () => {
  const router = useRouter();
  const { timezone } = useContext(TimezoneContext);
  return (
    <BytescaleUploadButton
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
          <ImageIcon className="mr-2 h-4 w-4" /> Upload Image
        </Button>
      )}
    </BytescaleUploadButton>
  );
};
