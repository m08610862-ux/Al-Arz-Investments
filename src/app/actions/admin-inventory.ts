"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { InventoryStatus } from "@prisma/client";

export async function updateInventoryStatus(id: string, status: InventoryStatus) {
  try {
    await requireAdmin();
    await prisma.inventoryItem.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
