import React, { useState, useRef } from "react";
import { ReactCrop, Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type ImageCropperProps = {
  imageUrl: string;
};

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl }) => {
  const [crop, setCrop] = useState<Crop>({});
  const [croppedImages, setCroppedImages] = useState<{ [key: string]: string }>(
    {}
  );
  const imageRef = useRef<HTMLImageElement>(null);

  const onCropComplete = (crop: Crop) => {
    makeClientCrop(crop);
  };

  const onCropChange = (newCrop: Crop) => {
    setCrop(newCrop);
  };

  const makeClientCrop = async (crop: Crop) => {
    if (imageRef.current && crop.width && crop.height) {
      let croppedImages = {} as { [key: string]: string };
      const croppedImageUrl = await getCroppedImg(
        imageRef.current!,
        crop,
        "original"
      );
      croppedImages["original"] = croppedImageUrl;

      // For other aspect ratios
      const aspectRatios = [1, 4 / 3, 16 / 9];
      for (const aspect of aspectRatios) {
        const aspectCroppedImageUrl = await getCroppedImg(
          imageRef.current,
          crop,
          aspect.toString()
        );
        croppedImages[aspect.toString()] = aspectCroppedImageUrl;
      }

      setCroppedImages(croppedImages);
    }
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop,
    aspectKey: string
  ): Promise<string> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    const aspect =
      aspectKey === "original"
        ? crop.width / crop.height
        : parseFloat(aspectKey);
    const width = crop.width * scaleX;
    const height = width / aspect;

    canvas.width = width;
    canvas.height = height;

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        width,
        height
      );
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          // reject new Error('Canvas is empty');
          console.error("Canvas is empty");
          return;
        }
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/jpeg");
    });
  };

  return (
    <div>
      <ReactCrop
        crop={crop}
        ruleOfThirds
        onComplete={onCropComplete}
        onChange={onCropChange}
      >
        <img
          src={`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`}
          ref={imageRef}
          alt="Crop preview"
        />
      </ReactCrop>
      <div className="mt-4 flex flex-wrap justify-around">
        {Object.keys(croppedImages)
          .filter((aspect) => aspect !== "original")
          .map((aspect) => (
            <div key={aspect} className="mt-2 h-24 w-24">
              <img
                alt={`Crop preview ${aspect}`}
                src={croppedImages[aspect]}
                crossOrigin="anonymous" // add this line
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImageCropper;
