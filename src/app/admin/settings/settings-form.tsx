"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/app/actions/settings";
import {
  Save,
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  Clock,
  CheckCircle2,
  Share2,
  Building,
  RefreshCw,
} from "lucide-react";
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

    try {
      const result = await updateSiteSettings(formData);
      setIsSaving(false);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 4000);
        router.refresh();
      } else {
        alert("Failed to save settings. Please try again.");
      }
    } catch (error) {
      setIsSaving(false);
      alert("An unexpected error occurred.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2.5 text-xs font-medium text-primary-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all";
  const labelClass = "block text-[11px] font-bold text-primary-700 mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* ── Success Alert ───────────────────────────────────────────────── */}
      {isSuccess && (
        <div className="bg-accent-50 text-accent-800 p-4 rounded-2xl border border-accent-200 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-accent-600 shrink-0" />
            <span>Site settings updated successfully. Changes are live on the website immediately!</span>
          </div>
          <span className="text-[10px] font-semibold text-accent-600">Saved</span>
        </div>
      )}

      {/* ── Section 1: Official Contact Information ─────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-100">
          <div className="h-9 w-9 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 border border-accent-100">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
              Official Contact Numbers &amp; Emails
            </h2>
            <p className="text-xs text-primary-500 mt-0.5">
              Displayed on public headers, footers, and direct enquiry cards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Primary Phone / WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 0000000"
                className={inputClass}
              />
            </div>
            <p className="text-[10px] text-primary-400 mt-1">Main phone line for client calls.</p>
          </div>

          <div>
            <label className={labelClass}>Secondary Phone / Landline</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                placeholder="+92 51 1234567"
                className={inputClass}
              />
            </div>
            <p className="text-[10px] text-primary-400 mt-1">Office landline or alternate contact.</p>
          </div>

          <div>
            <label className={labelClass}>Primary Official Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@alarzinvestments.com"
                className={inputClass}
              />
            </div>
            <p className="text-[10px] text-primary-400 mt-1">General inquiries email.</p>
          </div>

          <div>
            <label className={labelClass}>Support / Secondary Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="email"
                name="email2"
                value={formData.email2}
                onChange={handleChange}
                placeholder="support@alarzinvestments.com"
                className={inputClass}
              />
            </div>
            <p className="text-[10px] text-primary-400 mt-1">Direct support / executive desk.</p>
          </div>
        </div>
      </div>

      {/* ── Section 2: Office Location & Business Hours ─────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-100">
          <div className="h-9 w-9 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 border border-accent-100">
            <Building className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
              Physical Location &amp; Office Hours
            </h2>
            <p className="text-xs text-primary-500 mt-0.5">
              Headquarters location and working schedule displayed on contact pages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Street Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Executive Heights, Phase 7, DHA"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>City &amp; Country</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Islamabad / Rawalpindi, Pakistan"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Weekday Operating Hours</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                name="businessHours"
                value={formData.businessHours}
                onChange={handleChange}
                placeholder="Mon - Sat: 9:00 AM - 6:00 PM"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Weekend Operating Hours</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                name="businessHoursWeekend"
                value={formData.businessHoursWeekend}
                onChange={handleChange}
                placeholder="Sunday: Closed / By Appointment"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Official Social Media Links ───────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-100">
          <div className="h-9 w-9 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 border border-accent-100">
            <Share2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
              Official Social Media Channels
            </h2>
            <p className="text-xs text-primary-500 mt-0.5">
              Full URLs to your company profiles. Leave empty to omit the icon from the footer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Facebook Page URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/alarzinvestments"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Twitter / X URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/alarzinvestments"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Instagram Profile URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/alarzinvestments"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>LinkedIn Company URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/alarzinvestments"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Save Action Bar ──────────────────────────────────────── */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm">
        <p className="text-xs text-primary-500 font-medium">
          Ensure all numbers include proper dialing codes for direct WhatsApp / phone actions.
        </p>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-70 cursor-pointer"
        >
          {isSaving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}
