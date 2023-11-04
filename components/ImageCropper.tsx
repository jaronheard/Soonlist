/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from "react";
import { ReactCrop, Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type ImageCropperProps = {
  imageUrl: string;
};

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl }) => {
  const [crop, setCrop] = useState<Crop>();
  const [croppedImages, setCroppedImages] = useState<{ [key: string]: string }>(
    {}
  );
  const imageRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: {
    currentTarget: { naturalWidth: any; naturalHeight: any };
  }) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
          height: 100,
        },
        width / height,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  }

  const onCropComplete = (crop: Crop, percentageCrop: Crop) => {
    makeClientCrop(percentageCrop);
  };

  const onCropChange = (newCrop: Crop, newPercentageCrop: Crop) => {
    setCrop(newPercentageCrop);
  };

  const makeClientCrop = async (crop: Crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const aspectRatios = {
        square: 1,
        fourThree: 4 / 3,
        sixteenNine: 16 / 9,
      };

      let newCroppedImages = {} as { [key: string]: string };

      for (const [key, aspect] of Object.entries(aspectRatios)) {
        const croppedImageUrl = await getCroppedImg(
          imageRef.current,
          crop,
          aspect
        );
        newCroppedImages[key] = croppedImageUrl;
      }

      setCroppedImages(newCroppedImages);
    }
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop,
    targetAspect: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Convert crop percentages to pixels
      const pxCrop = {
        x: image.naturalWidth * (crop.x / 100),
        y: image.naturalHeight * (crop.y / 100),
        width: image.naturalWidth * (crop.width / 100),
        height: image.naturalHeight * (crop.height / 100),
      };

      // Calculate the new width and height based on the target aspect ratio
      let newWidth = pxCrop.width;
      let newHeight = newWidth / targetAspect;
      let offsetX = 0;
      let offsetY = 0;

      // Adjust if the new height is larger than the cropped area
      if (newHeight > pxCrop.height) {
        newHeight = pxCrop.height;
        newWidth = newHeight * targetAspect;
        // Center the crop area
        offsetX = (pxCrop.width - newWidth) / 2;
        offsetY = (pxCrop.height - newHeight) / 2;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      if (ctx) {
        // Draw the image slice on the canvas
        ctx.drawImage(
          image,
          pxCrop.x + offsetX,
          pxCrop.y + offsetY,
          newWidth,
          newHeight,
          0,
          0,
          newWidth,
          newHeight
        );
        // Resolve or reject the Promise based on the canvas operation success
        canvas.toBlob((blob) => {
          if (blob) {
            const imageURL = URL.createObjectURL(blob);
            resolve(imageURL);
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        }, "image/jpeg");
      } else {
        reject(new Error("2D context not available."));
      }
    });
  };

  return (
    <div>
      <div className="mx-auto h-64 w-full md:h-96 lg:h-auto lg:w-1/2">
        <ReactCrop
          crop={crop}
          onComplete={onCropComplete}
          onChange={onCropChange}
        >
          <img
            src={`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`}
            ref={imageRef}
            alt="Crop preview"
            onLoad={onImageLoad}
          />
        </ReactCrop>
      </div>
      <p className="mx-auto text-center text-sm font-medium leading-6 text-gray-500">
        Crop previews for site, will be expandable to full size
      </p>
      <div className="mx-auto flex max-w-sm flex-wrap justify-around">
        {Object.entries(croppedImages).map(([aspect, src]) => (
          <div key={aspect} className="mt-2 h-24 w-24">
            <img
              alt={`Crop preview ${aspect}`}
              src={src}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCropper;
