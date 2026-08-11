"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  PropertyCategory,
  PropertyListingType,
  PropertyStatus,
  PropertyLabel,
} from "@prisma/client";
import { z } from "zod";

// Helper to get the staff ID and verify they are STAFF role
async function getStaffId() {
  const session = await requireAuth();
  if (session.user.role === "ADMIN") {
    throw new Error("Admins should use the Admin panel.");
  }
  return session.user.id;
}

const intOrNull = z.string().nullable().optional().transform(v => v ? parseInt(v) : null);
const numberOrNull = z.string().nullable().optional().transform(v => v ? parseFloat(v) : null);

const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  price: z.coerce.number().positive("Price must be a positive number"),
  type: z.nativeEnum(PropertyListingType),
  category: z.nativeEnum(PropertyCategory),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  bedrooms: intOrNull,
  bathrooms: intOrNull,
  area: numberOrNull,
  areaUnit: z.enum(["MARLA", "KANAL", "SQFT", "Marla", "Kanal", "Sqft"]).default("MARLA"),
  society: z.string().nullable().optional(),
  phase: z.string().nullable().optional(),
  label: z.nativeEnum(PropertyLabel).default("NONE"),
  images: z.string().transform((val) => {
    try {
      return JSON.parse(val || "[]");
    } catch {
      return [];
    }
  }).pipe(z.array(z.string())),
});

const updatePropertySchema = propertySchema.extend({
  id: z.string().min(1, "ID is required"),
  status: z.nativeEnum(PropertyStatus),
});

export async function createProperty(data: FormData) {
  try {
    const staffId = await getStaffId();
    const parsedData = propertySchema.parse(Object.fromEntries(data));

    await prisma.property.create({
      data: {
        ...parsedData,
        createdById: staffId,    // Always set to current staff
        assignedToId: staffId,   // Auto-assign to creator
        status: "AVAILABLE",
      },
    });

    revalidatePath("/staff/properties");
    revalidatePath("/properties");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to create property." };
  }
}

export async function updateProperty(data: FormData) {
  try {
    const staffId = await getStaffId();
    const parsedData = updatePropertySchema.parse(Object.fromEntries(data));

    // DATA ISOLATION: ensure this property belongs to this staff member
    const existing = await prisma.property.findFirst({
      where: {
        id: parsedData.id,
        OR: [{ createdById: staffId }, { assignedToId: staffId }],
      },
    });
    if (!existing) {
      return { success: false, error: "Property not found or access denied." };
    }

    const { id, ...updateFields } = parsedData;

    await prisma.property.update({
      where: { id },
      data: updateFields,
    });

    revalidatePath("/staff/properties");
    revalidatePath("/properties");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to update property." };
  }
}

export async function deleteProperty(data: FormData) {
  try {
    const staffId = await getStaffId();
    const id = data.get("id") as string;

    // DATA ISOLATION: ensure this property belongs to this staff member
    const existing = await prisma.property.findFirst({
      where: {
        id,
        OR: [{ createdById: staffId }, { assignedToId: staffId }],
      },
    });
    if (!existing) {
      return { success: false, error: "Property not found or access denied." };
    }

    await prisma.property.delete({ where: { id } });

    revalidatePath("/staff/properties");
    revalidatePath("/properties");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to delete property." };
  }
}

export async function togglePropertyActiveStatus(id: string, isActive: boolean) {
  try {
    const staffId = await getStaffId();

    // DATA ISOLATION: ensure this property belongs to this staff member
    const existing = await prisma.property.findFirst({
      where: {
        id,
        OR: [{ createdById: staffId }, { assignedToId: staffId }],
      },
    });
    if (!existing) {
      return { success: false, error: "Property not found or access denied." };
    }

    await prisma.property.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/staff/properties");
    revalidatePath("/properties");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to update property visibility." };
  }
}
