"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const settingsSchema = z.object({
  phone: z.string().nullable().optional(),
  phone2: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  email2: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  businessHours: z.string().nullable().optional(),
  businessHoursWeekend: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  twitter: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
});

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings) return settings;

    // Default fallback if not found in DB
    return {
      phone: "+92 300 0000000",
      phone2: "+92 51 1234567",
      email: "info@alarz.com",
      email2: "support@alarz.com",
      address: "123 Business Avenue, Blue Area",
      city: "Islamabad, Pakistan",
      businessHours: "Mon - Sat: 9:00 AM - 6:00 PM",
      businessHoursWeekend: "Sunday: Closed",
      facebook: "https://facebook.com/alarz",
      twitter: "https://twitter.com/alarz",
      instagram: "https://instagram.com/alarz",
      linkedin: "https://linkedin.com/company/alarz",
    };
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return null;
  }
}

export async function updateSiteSettings(data: any) {
  try {
    // 1. Authorization: Only Admins can update site settings
    await requireAdmin();

    // 2. Validation: Validate incoming data with Zod
    const parsedData = settingsSchema.parse(data);

    const settings = await prisma.siteSettings.findFirst();

    if (settings) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: parsedData,
      });
    } else {
      await prisma.siteSettings.create({
        data: {
          id: "default",
          ...parsedData,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/properties");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update site settings:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update settings" 
    };
  }
}
