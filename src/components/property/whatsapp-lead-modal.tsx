"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, MessageCircle, Phone, User, Mail, Send, CheckCircle2 } from "lucide-react";
import { leadSchema } from "@/lib/validations";
import { submitLead } from "@/app/actions/lead";

type LeadFormValues = z.infer<typeof leadSchema>;

interface WhatsAppLeadModalProps {
  propertyId: string;
  propertyTitle: string;
  staffPhone: string | null;
}

// Fallback business number if staff member has no phone configured
const FALLBACK_BUSINESS_NUMBER = "923300276999";

export function WhatsAppLeadModal({
  propertyId,
  propertyTitle,
  staffPhone,
}: WhatsAppLeadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      message: `Hi, I am interested in "${propertyTitle}". Can you provide more details?`,
    },
  });



  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Save lead to DB
      const result = await submitLead(data, propertyId);

      if (!result.success) {
        setErrorMsg(result.error || "Failed to submit lead.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);

      // 2. Build WhatsApp Deep Link
      // User requested to always use the default number, regardless of staff's phone
      const targetPhone = FALLBACK_BUSINESS_NUMBER;
      
      // We encode the message so it's safe for a URL
      const propertyUrl = window.location.href;
      const waMessage = `*New Inquiry*\n\n*Name:* ${data.name}\n*Property:* ${propertyTitle}\n*Link:* ${propertyUrl}\n\n*Message:* ${data.message}\n\n_Sent via Al-Arz Investments_`;
      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;

      // 3. Open WhatsApp in new tab
      window.open(waUrl, "_blank", "noopener,noreferrer");

      // Optional: Auto-close modal after a delay
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        reset();
      }, 5000);

    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl active:scale-[0.98]"
      >
        <MessageCircle className="h-5 w-5" />
        Send Message on WhatsApp
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact via WhatsApp
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                  <h4 className="text-xl font-bold text-neutral-900">Message Prepared!</h4>
                  <p className="mt-2 text-neutral-600">
                    Your inquiry has been saved. We are opening WhatsApp so you can send your message directly to our agent.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <p className="text-sm text-neutral-600 mb-4">
                    Please provide your details before we connect you on WhatsApp.
                  </p>

                  {errorMsg && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        {...register("name")}
                        className={`w-full rounded-xl border bg-neutral-50 pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 transition-all ${
                          errors.name ? "border-red-300" : "border-neutral-200"
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        {...register("email")}
                        className={`w-full rounded-xl border bg-neutral-50 pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 transition-all ${
                          errors.email ? "border-red-300" : "border-neutral-200"
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      className={`w-full rounded-xl border bg-neutral-50 p-3 text-sm focus:ring-2 focus:ring-green-500 transition-all ${
                        errors.message ? "border-red-300" : "border-neutral-200"
                      }`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Continue to WhatsApp
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
