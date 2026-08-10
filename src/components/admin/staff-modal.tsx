"use client";

import { useState } from "react";
import { User, Mail, Phone, Lock, X, Briefcase } from "lucide-react";
import { createStaff, updateStaff } from "@/app/actions/admin-staff";

interface StaffData {
  id?: string;
  name: string;
  email: string;
  phone: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? "Edit Staff Member" : "Create New Staff Member"}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="name"
                  required
                  defaultValue={staff?.name}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="email"
                  type="email"
                  required
                  disabled={isEdit}
                  defaultValue={staff?.email}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  title={isEdit ? "Email cannot be changed after creation" : ""}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                WhatsApp / Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="phone"
                  defaultValue={staff?.phone}
                  placeholder="e.g. 923001234567"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500">Must include country code for WhatsApp (e.g. 923...)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Role / Designation
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="designation"
                  defaultValue={staff?.designation ?? ""}
                  placeholder="e.g. Senior Property Agent"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {!isEdit && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Initial Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">Staff can use this to log in, you must share this with them securely.</p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
