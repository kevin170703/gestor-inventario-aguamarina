import { IconPhotoPlus, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

interface UploadedImage {
  file: File;
  preview: string;
}

interface UploadImageProps {
  value?: string | null; // recibe imagen desde el padre
  onChange?: (image: UploadedImage | null) => void;
  id: string;
}

export default function UploadImage({ value, onChange, id }: UploadImageProps) {
  const [image, setImage] = useState<UploadedImage | null>(
    value ? { file: {} as File, preview: value } : null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImage = {
        file,
        preview: URL.createObjectURL(file),
      };
      setImage(newImage);
      onChange?.(newImage);
    }
  };

  const handleRemove = () => {
    if (image) URL.revokeObjectURL(image.preview);
    setImage(null);
    onChange?.(null);
  };

  return (
    <div className="col-span-full">
      <div
        className={`w-full aspect-square mt-2 flex justify-center relative ${
          !image ? "border" : ""
        } rounded-3xl border-dashed`}
      >
        {image ? (
          <div className="relative w-full h-full">
            <Image
              width={700}
              height={700}
              src={image.preview}
              alt="Preview"
              className="w-full h-full aspect-2/1 rounded-2xl object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 cursor-pointer"
            >
              <IconX className="size-5" />
            </button>
          </div>
        ) : (
          <div className="text-center flex flex-col justify-center items-center ">
            <div aria-hidden="true" className="mx-auto size-12 text-gray-600">
              <IconPhotoPlus className="size-full" />
            </div>
            <div className="mt-4 flex text-sm text-gray-400">
              <label
                htmlFor={`file-upload-${id}`}
                className="relative cursor-pointer rounded-md font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>Subir imagen</span>
                <input
                  id={`file-upload-${id}`}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleChange}
                />
              </label>
              <p className="pl-1">de portada</p>
            </div>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
}
