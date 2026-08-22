"use client";

import { useState } from "react";
import { User, Mail, Phone, Lock, X, Briefcase, UserPlus, ShieldCheck } from "lucide-react";
import { createStaff, updateStaff } from "@/app/actions/admin-staff";

interface StaffData {
  id?: string;
  name: string;
  email: string;
  phone: string | null;
  designation?: string | null;
}

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffData | null; // If provided, we are editing. If null, creating.
}

export function StaffModal({ isOpen, onClose, staff }: StaffModalProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isEdit = !!staff?.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (isEdit) {
      formData.append("id", staff.id!);
    }

    const action = isEdit ? updateStaff : createStaff;
    const result = await action(formData);

    if (!result.success) {
      setErrorMsg(result.error || "An error occurred.");
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-150">
        {/* Header matching Property & Client modals */}
        <div className="bg-accent-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-white" />
            <h3 className="text-base font-bold text-white tracking-tight">
              {isEdit ? "Edit Staff Advisor Profile" : "Register New Staff Advisor"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 border border-rose-100">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="name"
                  required
                  defaultValue={staff?.name}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="email"
                  type="email"
                  required
                  disabled={isEdit}
                  defaultValue={staff?.email}
                  placeholder="advisor@alarz.com"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 disabled:opacity-50 outline-none transition-all"
                  title={isEdit ? "Email cannot be changed after creation" : ""}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                WhatsApp / Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="phone"
                  defaultValue={staff?.phone ?? ""}
                  placeholder="e.g. 923001234567"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none transition-all"
                />
              </div>
              <p className="mt-1 text-[10px] text-primary-400">
                Include country code for direct WhatsApp (e.g. 92300...)
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                Designation / Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="designation"
                  defaultValue={staff?.designation ?? ""}
                  placeholder="e.g. Senior Investment Advisor"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none transition-all"
                />
              </div>
            </div>

            {!isEdit && (
              <div>
                <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                  Initial Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none transition-all"
                  />
                </div>
                <p className="mt-1 text-[10px] text-primary-400">
                  Temporary password for first-time staff login.
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-primary-700 hover:bg-neutral-50 rounded-xl border border-neutral-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-accent-500 hover:bg-accent-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Staff Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
