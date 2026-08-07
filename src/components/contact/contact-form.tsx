"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle, Send, CheckCircle2, User, Phone, Mail } from "lucide-react";
import { leadSchema } from "@/lib/validations";
import { submitContactLead } from "@/app/actions/lead";

type ContactFormValues = z.infer<typeof leadSchema>;

interface StaffMember {
  id: string;
  name: string | null;
  phone: string | null;
}

interface ContactFormProps {
  staffList: StaffMember[];
}

const FALLBACK_BUSINESS_NUMBER = "923000000000";

export function ContactForm({ staffList }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const cleanPhoneNumber = (phone: string | null) => {
    if (!phone) return FALLBACK_BUSINESS_NUMBER;
    return phone.replace(/\D/g, "");
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const result = await submitContactLead(data, selectedStaffId || undefined);

      if (!result.success) {
        setErrorMsg(result.error || "Failed to submit message.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);

      // Find staff phone if selected
      const selectedStaff = staffList.find((s) => s.id === selectedStaffId);
      const targetPhone = cleanPhoneNumber(selectedStaff?.phone || null);
      
      const waMessage = `*New Inquiry*\n\n*Name:* ${data.name}\n\n*Message:* ${data.message}\n\n_Sent via Al-Arz Investments Contact Page_`;
      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;

      window.open(waUrl, "_blank", "noopener,noreferrer");

      setTimeout(() => {
        setIsSuccess(false);
        reset();
        setSelectedStaffId("");
      }, 5000);

    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-neutral-900">Message Sent!</h3>
        <p className="mt-2 text-neutral-600 max-w-sm">
          We have recorded your inquiry and are opening WhatsApp so you can chat directly with us.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                {...register("name")}
                className={`w-full rounded-xl border bg-neutral-50 pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 transition-all ${
                  errors.name ? "border-red-300" : "border-neutral-200"
                }`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                {...register("phone")}
                className={`w-full rounded-xl border bg-neutral-50 pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 transition-all ${
                  errors.phone ? "border-red-300" : "border-neutral-200"
                }`}
                placeholder="03001234567"
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">
              Email <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                {...register("email")}
                className={`w-full rounded-xl border bg-neutral-50 pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 transition-all ${
                  errors.email ? "border-red-300" : "border-neutral-200"
                }`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">
              Select an Agent <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="">Any Available Agent</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-neutral-700">Message *</label>
          <textarea
            {...register("message")}
            rows={5}
            className={`w-full rounded-xl border bg-neutral-50 p-4 text-sm focus:ring-2 focus:ring-primary-500 transition-all ${
              errors.message ? "border-red-300" : "border-neutral-200"
            }`}
            placeholder="How can we help you today?"
          />
          {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Inquiry
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}
