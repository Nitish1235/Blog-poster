"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  accept?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
  required = false,
  className = "",
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      onChange(data.url);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <label className="block font-bold uppercase text-sm mb-2 admin-label">
        {label} {required && "*"}
      </label>

      {preview ? (
        <div className="relative w-full border-2 border-border rounded-[10px] overflow-hidden admin-card">
          <div className="relative w-full h-48 sm:h-64 bg-gray-100">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 100vw"
            />
          </div>
          <div className="p-3 flex items-center justify-between bg-white dark:bg-gray-800 border-t-2 border-border">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <ImageIcon size={16} className="text-gray-500 flex-shrink-0" />
              <span className="text-xs font-medium admin-link truncate">
                {value || "Image uploaded"}
              </span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="admin-button"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 size={14} className="mr-1 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={14} className="mr-1" /> Change
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="admin-button"
                disabled={uploading}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed border-border rounded-[10px] p-6 sm:p-8 text-center transition-colors ${
            uploading
              ? "bg-gray-100 dark:bg-gray-800"
              : "bg-white dark:bg-gray-800 hover:border-primary cursor-pointer"
          }`}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-primary" />
              <p className="text-sm font-medium admin-link">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase admin-heading mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs font-medium admin-link">
                  PNG, JPG, GIF, WebP up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-[10px]">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {value && !preview && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-[10px]">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
            Using existing image URL: {value.substring(0, 50)}...
          </p>
        </div>
      )}
    </div>
  );
}
