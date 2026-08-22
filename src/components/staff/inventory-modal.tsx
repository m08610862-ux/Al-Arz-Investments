"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Trash2, Building2 } from "lucide-react";
import {
  createStaffInventory,
  updateStaffInventory,
} from "@/app/actions/staff-inventory";
import { InventoryRow } from "./inventory-table";

/** Compress an image File to JPEG at given quality, max 1800px wide. */
async function compressImage(file: File, quality = 0.85): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1800;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        const ratio = Math.min(MAX / width, MAX / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return resolve(file);
          const name = file.name.replace(/\.[^.]+$/, ".jpg");
          resolve(new File([blob], name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory?: InventoryRow | null;
  onSuccess?: (item: InventoryRow, isEdit: boolean) => void;
}

export function InventoryModal({ isOpen, onClose, inventory, onSuccess }: InventoryModalProps) {
  const isEdit = !!inventory?.id;
  const [images, setImages] = useState<string[]>(inventory?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state whenever the modal opens or the inventory prop changes
  useEffect(() => {
    setImages(inventory?.images ?? []);
    setErrorMsg("");
  }, [inventory?.id, isOpen]);

  if (!isOpen) return null;

  const MAX_IMAGES = 10;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setErrorMsg(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    const toUpload = files.slice(0, remaining);
    if (files.length > remaining) {
      setErrorMsg(`Only ${remaining} more image(s) can be added (max ${MAX_IMAGES}). Extra files were skipped.`);
    }

    setUploading(true);
    try {
      // Step 1: Compress all images in parallel
      const compressed = await Promise.all(toUpload.map((f) => compressImage(f)));

      // Step 2: Upload all compressed images in parallel
      const results = await Promise.all(
        compressed.map(async (file, i) => {
          const rawFile = toUpload[i];
          const fd = new FormData();
          fd.append("file", file);
          try {
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            if (!res.ok) {
              const text = await res.text();
              let msg = "Upload failed";
              try {
                msg = JSON.parse(text).error || msg;
              } catch {
                msg = `Server Error (${res.status})`;
              }
              return { url: null, error: `[${rawFile.name}] ${msg}` };
            }
            const json = await res.json();
            return json.url
              ? { url: json.url as string, error: null }
              : { url: null, error: `[${rawFile.name}] ${json.error || "Failed"}` };
          } catch {
            return { url: null, error: `[${rawFile.name}] Network error` };
          }
        })
      );

      const newUrls = results.filter((r) => r.url).map((r) => r.url as string);
      const errors = results.filter((r) => r.error).map((r) => r.error as string);

      if (newUrls.length > 0) setImages((prev) => [...prev, ...newUrls]);
      if (errors.length > 0) setErrorMsg(errors.join("  |  "));
      else setErrorMsg("");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((i) => i !== url));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    fd.set("images", JSON.stringify(images));

    try {
      let result;
      if (isEdit && inventory) {
        result = await updateStaffInventory(inventory.id, fd);
      } else {
        result = await createStaffInventory(fd);
      }

      if (!result.success) {
        setErrorMsg(result.error || "An error occurred.");
        setIsSubmitting(false);
      } else {
        if (onSuccess && result.item) {
          onSuccess(result.item as InventoryRow, isEdit);
        }
        onClose();
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 animate-in fade-in zoom-in duration-200 overflow-hidden">
        {/* Header - exactly identical to Add Property Modal */}
        <div className="bg-primary-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-white" />
            <h3 className="text-lg font-bold text-white">
              {isEdit ? "Edit Inventory" : "Add New Inventory"}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="label">Title *</label>
              <input
                name="title"
                required
                defaultValue={inventory?.title ?? (inventory?.number ? `Plot/Unit ${inventory.number}` : "")}
                className="input"
                placeholder="e.g. Luxury 5 Marla House / Corner Plot"
              />
            </div>

            {/* Price */}
            <div>
              <label className="label">Price (PKR) *</label>
              <input
                name="price"
                type="number"
                required
                defaultValue={inventory?.price ?? ""}
                className="input"
                placeholder="e.g. 25000000"
              />
            </div>

            {/* City */}
            <div>
              <label className="label">City *</label>
              <select name="city" required defaultValue={inventory?.city ?? "Rawalpindi"} className="input">
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Islamabad">Islamabad</option>
              </select>
            </div>

            {/* Society */}
            <div>
              <label className="label">Society</label>
              <select name="society" defaultValue={inventory?.society ?? ""} className="input">
                <option value="">— None —</option>
                <option value="DHA">DHA</option>
                <option value="Bahria Town">Bahria Town</option>
              </select>
            </div>

            {/* Phase */}
            <div>
              <label className="label">Phase</label>
              <select name="phase" defaultValue={inventory?.phase ?? ""} className="input">
                <option value="">— None —</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                  <option key={p} value={`Phase ${p}`}>
                    Phase {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Type / Purpose */}
            <div>
              <label className="label">Type *</label>
              <select name="type" required defaultValue={inventory?.type ?? inventory?.purpose ?? "SALE"} className="input">
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
                <option value="INVESTMENT">Investment</option>
              </select>
            </div>

            {/* Category / Property Type */}
            <div>
              <label className="label">Category *</label>
              <select name="category" required defaultValue={inventory?.category ?? inventory?.propertyType ?? "HOUSE"} className="input">
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="PLOT">Plot</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="SHOP">Shop</option>
                <option value="FARMHOUSE">Farmhouse</option>
                <option value="VILLA">Villa</option>
                <option value="BUILDING">Building</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="label">Status</label>
              <select name="status" defaultValue={inventory?.status ?? "AVAILABLE"} className="input">
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                <option value="RENTED">Rented</option>
                <option value="RESERVED">Reserved</option>
              </select>
            </div>

            {/* Label (Urgency) */}
            <div>
              <label className="label">Label (Urgency)</label>
              <select name="label" defaultValue={inventory?.label ?? "NONE"} className="input">
                <option value="NONE">None</option>
                <option value="HOT">Hot</option>
                <option value="SUPER_HOT">Super Hot</option>
              </select>
            </div>

            {/* House / Street Address */}
            <div className="sm:col-span-2">
              <label className="label">House / Street Address *</label>
              <input
                name="address"
                required
                defaultValue={inventory?.address ?? inventory?.street ?? ""}
                className="input"
                placeholder="e.g. House 12, Street 5, Block A"
              />
              <p className="text-xs text-neutral-400 mt-1">
                City, Society &amp; Phase will be added automatically to complete the address.
              </p>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="label">Bedrooms</label>
              <input
                name="bedrooms"
                type="number"
                min="0"
                defaultValue={inventory?.bedrooms ?? ""}
                className="input"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="label">Bathrooms</label>
              <input
                name="bathrooms"
                type="number"
                min="0"
                defaultValue={inventory?.bathrooms ?? ""}
                className="input"
              />
            </div>

            {/* Area Size */}
            <div className="sm:col-span-2">
              <label className="label">Area Size</label>
              <div className="flex gap-2">
                <input
                  name="area"
                  type="number"
                  min="0"
                  step="any"
                  defaultValue={inventory?.area ?? (inventory?.size ? parseFloat(inventory.size) : "")}
                  className="input"
                  style={{ flex: 1, width: "auto", minWidth: 0 }}
                  placeholder="Enter area number"
                />
                <select
                  name="areaUnit"
                  defaultValue={inventory?.areaUnit ?? inventory?.sizeUnit ?? "MARLA"}
                  className="input"
                  style={{ width: "7rem", flexShrink: 0 }}
                >
                  <option value="MARLA">Marla</option>
                  <option value="KANAL">Kanal</option>
                  <option value="SQFT">Sqft</option>
                </select>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <label className="label">Contact Number</label>
              <input
                name="contact"
                defaultValue={inventory?.contact ?? ""}
                className="input"
                placeholder="e.g. 0300-1234567"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={inventory?.description ?? inventory?.detail ?? ""}
                className="input resize-none"
                placeholder="Describe the property/inventory item..."
              />
            </div>

            {/* Internal Comment */}
            <div className="sm:col-span-2">
              <label className="label">Internal Comment / Notes</label>
              <textarea
                name="comment"
                rows={2}
                defaultValue={inventory?.comment ?? ""}
                className="input resize-none"
                placeholder="Private remarks, dealer commission, owner notes..."
              />
            </div>
          </div>

          {/* Image Upload - exactly identical to Add Property Modal */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label !mb-0">Photos</label>
              <span
                className={`text-xs font-medium ${
                  images.length >= MAX_IMAGES ? "text-red-500" : "text-neutral-400"
                }`}
              >
                {images.length} / {MAX_IMAGES}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || images.length >= MAX_IMAGES}
              className="flex items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 hover:border-primary-400 hover:text-primary-600 transition-colors w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-4 w-4" />
              {uploading
                ? "Uploading..."
                : images.length >= MAX_IMAGES
                ? "Maximum images reached"
                : `Click to upload images (${MAX_IMAGES - images.length} remaining)`}
            </button>
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((url) => (
                  <div
                    key={url}
                    className="relative group aspect-square rounded-lg overflow-hidden bg-neutral-100"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-700 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Inventory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
