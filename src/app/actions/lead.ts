"use server";

import prisma from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";
import * as z from "zod";

export async function submitLead(
  data: z.infer<typeof leadSchema>,
  propertyId: string
) {
  try {
    // 1. Validate the incoming data
    const validatedData = leadSchema.parse(data);

    // 2. Fetch the property to find the assigned staff
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        assignedToId: true,
        createdById: true,
      },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    // Assign to the specific staff member managing the property, or fallback to the creator
    const staffId = property.assignedToId || property.createdById;

    // 3. Save the lead (Client) to the database
    await prisma.client.create({
      data: {
        name: validatedData.name,
        phone: validatedData.phone || "Via WhatsApp",
        email: validatedData.email || null,
        message: validatedData.message,
        propertyId: propertyId,
        assignedStaffId: staffId,
        source: "WEBSITE",
        status: "NEW",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit lead:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid form data. Please check your inputs." };
    }
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

export async function submitContactLead(
  data: z.infer<typeof leadSchema>,
  staffId?: string
) {
  try {
    const validatedData = leadSchema.parse(data);

    await prisma.client.create({
      data: {
        name: validatedData.name,
        phone: validatedData.phone || "Not Provided",
        email: validatedData.email || null,
        message: validatedData.message,
        assignedStaffId: staffId || null,
        source: "WEBSITE",
        status: "NEW",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit contact lead:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid form data. Please check your inputs." };
    }
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
