"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadProfileImage, removeProfileImage } from "@/app/actions/profile";
import { Camera, Trash2, Upload, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
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
      setTimeout(() => setStatus(null), 4000);
      router.refresh();
    } else {
      setPreview(currentImage);
      setStatus({ type: "error", message: result.error || "Upload failed. Please try again." });
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;
    setIsRemoving(true);
    setStatus(null);
    const result = await removeProfileImage();
    setIsRemoving(false);

    if (result.success) {
      setPreview(null);
      setStatus({ type: "success", message: "Profile photo removed." });
      setTimeout(() => setStatus(null), 4000);
      router.refresh();
    } else {
      setStatus({ type: "error", message: "Failed to remove photo." });
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Avatar Frame */}
      <div className="relative group">
        <div className="h-32 w-32 rounded-2xl overflow-hidden bg-accent-500 border-4 border-white shadow-lg flex items-center justify-center relative">
          {preview ? (
            <Image
              src={preview}
              alt={userName}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <span className="text-3xl font-black text-white select-none">{initials}</span>
          )}
        </div>

        {/* Camera overlay trigger */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-inner"
          title="Change photo"
        >
          <Camera className="h-7 w-7 text-white" />
        </button>
      </div>

      {/* Status Feedback */}
      {status && (
        <div
          className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl w-full text-center justify-center ${
            status.type === "success"
              ? "bg-accent-50 text-accent-700 border border-accent-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-70 cursor-pointer"
        >
          {isUploading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isRemoving}
            className="inline-flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-600 border border-neutral-200 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-70 cursor-pointer"
            title="Remove photo"
          >
            {isRemoving ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      <p className="text-[10px] text-primary-400 text-center">
        JPG, PNG or WebP · Max 5MB · Auto-cropped for advisor cards
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
