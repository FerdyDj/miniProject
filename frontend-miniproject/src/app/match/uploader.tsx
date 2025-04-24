"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  onChange?: (file: File | null) => void;
}

export default function ImageUploader({ onChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange?.(file);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-full cursor-pointer flex items-center justify-center bg-slate-100 hover:bg-gray-200 transition rounded-md overflow-hidden relative"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {previewUrl ? (
        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
      ) : (
        <span className="text-gray-400 text-sm">Click to upload match image</span>
      )}
    </div>
  );
}