"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadProfileImage, removeProfileImage } from "@/app/actions/profile";
import { Camera, Trash2, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileImageUploaderProps {
  currentImage: string | null;
  userName: string;
}

export function ProfileImageUploader({ currentImage, userName }: ProfileImageUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const initials = (userName || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadProfileImage(formData);
    setIsUploading(false);

    if (result.success) {
      setStatus({ type: "success", message: "Profile photo updated successfully!" });
      router.refresh();
    } else {
      setPreview(currentImage);
      setStatus({ type: "error", message: result.error || "Upload failed." });
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    setStatus(null);
    const result = await removeProfileImage();
    setIsRemoving(false);

    if (result.success) {
      setPreview(null);
      setStatus({ type: "success", message: "Profile photo removed." });
      router.refresh();
    } else {
      setStatus({ type: "error", message: "Failed to remove photo." });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Avatar */}
      <div className="relative group">
        <div className="h-36 w-36 rounded-full overflow-hidden bg-primary-700 border-4 border-white shadow-xl flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt={userName}
              fill
              className="object-cover"
              sizes="144px"
            />
          ) : (
            <span className="text-4xl font-black text-white select-none">{initials}</span>
          )}
        </div>

        {/* Camera overlay on hover */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Change photo"
        >
          <Camera className="h-8 w-8 text-white" />
        </button>
      </div>

      {/* Status message */}
      {status && (
        <div
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {status.message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-70"
        >
          {isUploading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isUploading ? "Uploading..." : "Upload Photo"}
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isRemoving}
            className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-70"
          >
            {isRemoving ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Remove
          </button>
        )}
      </div>

      <p className="text-xs text-neutral-400 text-center">
        JPG, PNG or WebP · Max 5MB · Square crop recommended
      </p>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
