"use client";

import { useState, useRef } from "react";
import { X, Upload, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { createProperty, updateProperty } from "@/app/actions/staff-properties";

type PropertyData = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: string;
  category: string;
  address: string;
  city: string;
  society: string | null;
  phase: string | null;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  isActive: boolean;
  label: string;
  images: string[];
};

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: PropertyData | null;
}

export function PropertyModal({ isOpen, onClose, property }: PropertyModalProps) {
  const isEdit = !!property?.id;
  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (json.url) setImages((prev) => [...prev, json.url]);
        else setErrorMsg(json.error || "Upload failed.");
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((i) => i !== url));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    const fd = new FormData(e.currentTarget);
    fd.set("images", JSON.stringify(images));
    if (isEdit) fd.append("id", property.id);
    const action = isEdit ? updateProperty : createProperty;
    const result = await action(fd);
    if (!result.success) {
      setErrorMsg(result.error || "An error occurred.");
      setIsSubmitting(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 animate-in fade-in zoom-in duration-200">
        <div className="bg-primary-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? "Edit Property" : "Add New Property"}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Title *</label>
              <input name="title" required defaultValue={property?.title} className="input" placeholder="e.g. Luxury 5 Marla House" />
            </div>

            <div>
              <label className="label">Price (PKR) *</label>
              <input name="price" type="number" required defaultValue={property?.price} className="input" placeholder="e.g. 25000000" />
            </div>

            <div>
              <label className="label">City *</label>
              <select name="city" required defaultValue={property?.city ?? "Rawalpindi"} className="input">
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Islamabad">Islamabad</option>
              </select>
            </div>

            <div>
              <label className="label">Society</label>
              <select name="society" defaultValue={property?.society ?? ""} className="input">
                <option value="">— None —</option>
                <option value="DHA">DHA</option>
                <option value="Bahria Town">Bahria Town</option>
              </select>
            </div>

            <div>
              <label className="label">Phase</label>
              <select name="phase" defaultValue={property?.phase ?? ""} className="input">
                <option value="">— None —</option>
                {[1,2,3,4,5,6,7,8].map(p => (
                  <option key={p} value={`Phase ${p}`}>Phase {p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Type *</label>
              <select name="type" required defaultValue={property?.type ?? "SALE"} className="input">
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
                <option value="INVESTMENT">Investment</option>
              </select>
            </div>

            <div>
              <label className="label">Category *</label>
              <select name="category" required defaultValue={property?.category ?? "HOUSE"} className="input">
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

            {isEdit && (
              <div>
                <label className="label">Status</label>
                <select name="status" defaultValue={property?.status ?? "AVAILABLE"} className="input">
                  <option value="AVAILABLE">Available</option>
                  <option value="SOLD">Sold</option>
                  <option value="RENTED">Rented</option>
                  <option value="RESERVED">Reserved</option>
                </select>
              </div>
            )}

            <div>
              <label className="label">Label (Urgency)</label>
              <select name="label" defaultValue={property?.label ?? "NONE"} className="input">
                <option value="NONE">None</option>
                <option value="HOT">Hot</option>
                <option value="SUPER_HOT">Super Hot</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="label">House / Street Address *</label>
              <input name="address" required defaultValue={property?.address} className="input" placeholder="e.g. House 12, Street 5, Block A" />
              <p className="text-xs text-neutral-400 mt-1">City, Society &amp; Phase will be added automatically to complete the address.</p>
            </div>

            <div>
              <label className="label">Bedrooms</label>
              <input name="bedrooms" type="number" min="0" defaultValue={property?.bedrooms ?? ""} className="input" />
            </div>

            <div>
              <label className="label">Bathrooms</label>
              <input name="bathrooms" type="number" min="0" defaultValue={property?.bathrooms ?? ""} className="input" />
            </div>

            <div>
              <label className="label">Area (sq ft)</label>
              <input name="area" type="number" min="0" defaultValue={property?.area ?? ""} className="input" />
            </div>


            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea name="description" rows={4} defaultValue={property?.description ?? ""} className="input resize-none" placeholder="Describe the property..." />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">Photos</label>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 hover:border-primary-400 hover:text-primary-600 transition-colors w-full justify-center"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Click to upload images"}
            </button>
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((url) => (
                  <div key={url} className="relative group aspect-square rounded-lg overflow-hidden bg-neutral-100">
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

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-700 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
