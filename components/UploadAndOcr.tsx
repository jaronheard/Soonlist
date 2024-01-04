import { UploadButton } from "@bytescale/upload-widget-react";
import { createWorker } from "tesseract.js";
import { Button } from "./ui/button";

export const performOCR = async (imagePath: string): Promise<void> => {
  const worker = await createWorker();

  try {
    const {
      data: { text },
    } = await worker.recognize(imagePath);
    console.log("OCR Result:", text);
    // Handle the OCR result here

    await worker.terminate();
  } catch (error) {
    console.error("OCR failed", error);
  }
};

const widgetOptions = {
  apiKey: "public_12a1yekATNiLj4VVnREZ8c7LM8V8",
  maxFileCount: 1,
  showFinishButton: true,
  styles: {
    colors: {
      primary: "#377dff",
    },
  },
  editor: {
    images: {
      crop: false,
      preview: false,
    },
  },
  onPreUpload: (files: any) => {
    console.log("Files to upload:", files);
    // if (files.length > 0) {
    //   const fileUrl = files[0]?.fileUrl;
    //   fileUrl && performOCR(fileUrl); // Start OCR on the uploaded image
    // }
    return undefined;
  },
};

export const UploadAndOcrButton = () => (
  <UploadButton
    options={widgetOptions}
    onComplete={(files) => {
      console.log("Files uploaded:", files);
      // if (files.length > 0) {
      //   const fileUrl = files[0]?.fileUrl;
      //   fileUrl && performOCR(fileUrl); // Start OCR on the uploaded image
      // }
    }}
  >
    {({ onClick }) => <Button onClick={onClick}>Upload and OCR</Button>}
  </UploadButton>
);
