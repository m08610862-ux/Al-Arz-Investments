"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { InventoryStatus } from "@prisma/client";

// ─── Auto-sync parent property status based on all units ───────────────────
async function syncPropertyStatus(propertyId: string) {
  const units = await prisma.inventoryItem.findMany({
    where: { propertyId },
    select: { status: true },
  });

  if (units.length === 0) return;

  const allSold = units.every((u) => u.status === "SOLD");
  const allRented = units.every((u) => u.status === "RENTED");
  const allUnavailable = units.every(
    (u) => u.status === "SOLD" || u.status === "RENTED"
  );
  const hasAvailable = units.some((u) => u.status === "AVAILABLE");

  let newStatus: "AVAILABLE" | "SOLD" | "RENTED" | "RESERVED" = "AVAILABLE";

  if (allSold) newStatus = "SOLD";
  else if (allRented) newStatus = "RENTED";
  else if (allUnavailable) newStatus = "SOLD"; // Mixed sold+rented → mark sold
  else if (hasAvailable) newStatus = "AVAILABLE";

  await prisma.property.update({
    where: { id: propertyId },
    data: { status: newStatus },
  });
}

// ─── Verify property ownership ──────────────────────────────────────────────
async function verifyPropertyAccess(propertyId: string, staffId: string, role: string) {
  if (role === "ADMIN") return true;
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      OR: [{ createdById: staffId }, { assignedToId: staffId }],
    },
  });
  return !!property;
}

// ─── CREATE ─────────────────────────────────────────────────────────────────
export async function addInventoryItem(data: FormData) {
  try {
    const session = await requireAuth();
    const propertyId = data.get("propertyId") as string;

    const hasAccess = await verifyPropertyAccess(propertyId, session.user.id, session.user.role!);
    if (!hasAccess) return { success: false, error: "Access denied." };

    const unitNumber = data.get("unitNumber") as string;
    const floor = data.get("floor") ? parseInt(data.get("floor") as string) : null;
    const area = data.get("area") ? parseFloat(data.get("area") as string) : null;
    const price = data.get("price") ? parseFloat(data.get("price") as string) : null;

    if (!unitNumber) return { success: false, error: "Unit number is required." };

    await prisma.inventoryItem.create({
      data: {
        propertyId,
        unitNumber,
        floor,
        area,
        price,
        status: "AVAILABLE",
      },
    });

    await syncPropertyStatus(propertyId);
    revalidatePath("/staff/inventory");
    revalidatePath("/admin/inventory");
    revalidatePath(`/properties/${propertyId}`);
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "A unit with this number already exists in this property." };
    }
    return { success: false, error: error.message || "Failed to add unit." };
  }
}

// ─── UPDATE ─────────────────────────────────────────────────────────────────
export async function updateInventoryItem(data: FormData) {
  try {
    const session = await requireAuth();
    const id = data.get("id") as string;
    const status = data.get("status") as InventoryStatus;

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      select: { propertyId: true },
    });
    if (!item) return { success: false, error: "Unit not found." };

    const hasAccess = await verifyPropertyAccess(item.propertyId, session.user.id, session.user.role!);
    if (!hasAccess) return { success: false, error: "Access denied." };

    const unitNumber = data.get("unitNumber") as string;
    const floor = data.get("floor") ? parseInt(data.get("floor") as string) : null;
    const area = data.get("area") ? parseFloat(data.get("area") as string) : null;
    const price = data.get("price") ? parseFloat(data.get("price") as string) : null;

    await prisma.inventoryItem.update({
      where: { id },
      data: { unitNumber, floor, area, price, status },
    });

    // Auto-sync parent property status
    await syncPropertyStatus(item.propertyId);

    revalidatePath("/staff/inventory");
    revalidatePath("/admin/inventory");
    revalidatePath(`/properties/${item.propertyId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update unit." };
  }
}

// ─── DELETE ─────────────────────────────────────────────────────────────────
export async function deleteInventoryItem(id: string) {
  try {
    const session = await requireAuth();

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      select: { propertyId: true },
    });
    if (!item) return { success: false, error: "Unit not found." };

    const hasAccess = await verifyPropertyAccess(item.propertyId, session.user.id, session.user.role!);
    if (!hasAccess) return { success: false, error: "Access denied." };

    await prisma.inventoryItem.delete({ where: { id } });

    await syncPropertyStatus(item.propertyId);

    revalidatePath("/staff/inventory");
    revalidatePath("/admin/inventory");
    revalidatePath(`/properties/${item.propertyId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete unit." };
  }
}
