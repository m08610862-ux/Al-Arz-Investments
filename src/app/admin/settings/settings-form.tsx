"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/app/actions/settings";
import { Save, MapPin, Phone, Mail, Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type SiteSettingsData = {
  phone?: string | null;
  phone2?: string | null;
  email?: string | null;
  email2?: string | null;
  address?: string | null;
  city?: string | null;
  businessHours?: string | null;
  businessHoursWeekend?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
};

export function SettingsForm({ initialData }: { initialData: SiteSettingsData }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    phone: initialData.phone || "",
    phone2: initialData.phone2 || "",
    email: initialData.email || "",
    email2: initialData.email2 || "",
    address: initialData.address || "",
    city: initialData.city || "",
    businessHours: initialData.businessHours || "",
    businessHoursWeekend: initialData.businessHoursWeekend || "",
    facebook: initialData.facebook || "",
    twitter: initialData.twitter || "",
    instagram: initialData.instagram || "",
    linkedin: initialData.linkedin || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSuccess(false);

    const result = await updateSiteSettings(formData);
    setIsSaving(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
      router.refresh();
    } else {
      alert("Failed to save settings. Please try again.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";
  const labelClass = "block text-sm font-semibold text-neutral-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isSuccess && (
        <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 font-medium flex items-center gap-3">
          <span className="text-green-500 text-lg">✓</span>
          Settings saved! The website has been updated instantly.
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm disabled:opacity-70"
        >
          {isSaving ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
          <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Contact Information</h2>
            <p className="text-sm text-neutral-500">Shown in the header, footer and contact page.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Primary Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+92 300 0000000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Secondary Phone</label>
            <input type="text" name="phone2" value={formData.phone2} onChange={handleChange} placeholder="+92 51 1234567" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Primary Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="info@alarz.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Secondary Email</label>
            <input type="email" name="email2" value={formData.email2} onChange={handleChange} placeholder="support@alarz.com" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Office & Hours */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
          <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Office & Hours</h2>
            <p className="text-sm text-neutral-500">Location and business hours shown on the contact page.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Street Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Business Avenue, Blue Area" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>City / Country</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Islamabad, Pakistan" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Weekday Hours</label>
            <input type="text" name="businessHours" value={formData.businessHours} onChange={handleChange} placeholder="Mon - Sat: 9:00 AM - 6:00 PM" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Weekend Hours</label>
            <input type="text" name="businessHoursWeekend" value={formData.businessHoursWeekend} onChange={handleChange} placeholder="Sunday: Closed" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
          <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Social Media Links</h2>
            <p className="text-sm text-neutral-500">Full URLs. Leave blank to hide the icon in the footer.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Facebook</label>
            <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="https://facebook.com/alarz" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Twitter / X</label>
            <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="https://twitter.com/alarz" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Instagram</label>
            <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="https://instagram.com/alarz" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/company/alarz" className={inputClass} />
          </div>
        </div>
      </div>
    </form>
  );
}
