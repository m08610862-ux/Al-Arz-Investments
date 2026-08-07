"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function togglePropertyFeature(id: string, featured: boolean) {
  try {
    await requireAdmin();
    await prisma.property.update({
      where: { id },
      data: { featured },
    });
    revalidatePath("/admin/properties");
    revalidatePath("/"); // Homepage has featured properties
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProperty(id: string) {
  try {
    await requireAdmin();
    // Due to Cascade relations (like Inventory items) setup in Prisma, deleting a property will delete its children
    await prisma.property.delete({
      where: { id },
    });
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reassignProperty(propertyId: string, staffId: string) {
  try {
    await requireAdmin();
    await prisma.property.update({
      where: { id: propertyId },
      data: { assignedToId: staffId },
    });
    revalidatePath("/admin/properties");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminTogglePropertyActiveStatus(id: string, isActive: boolean) {
  try {
    await requireAdmin();
    await prisma.property.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
