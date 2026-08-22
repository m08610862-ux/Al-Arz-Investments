"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getStaffId() {
  const session = await requireAuth();
  return session.user.id;
}

export type StaffInventoryInput = {
  title?: string | null;
  price?: number | string | null;
  city?: string | null;
  society?: string | null;
  phase?: string | null;
  type?: string | null;
  purpose?: string | null;
  category?: string | null;
  propertyType?: string | null;
  status?: string | null;
  label?: string | null;
  address?: string | null;
  street?: string | null;
  plotNo?: string | null;
  number?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  areaUnit?: string | null;
  size?: string | null;
  sizeUnit?: string | null;
  description?: string | null;
  detail?: string | null;
  images?: string[];
  contact?: string | null;
  comment?: string | null;
};

export async function getStaffInventory() {
  try {
    const staffId = await getStaffId();
    const items = await prisma.staffInventory.findMany({
      where: { createdById: staffId },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: items };
  } catch (error: any) {
    console.error("Error fetching staff inventory:", error);
    return { success: false, error: error.message || "Failed to fetch inventory." };
  }
}

export async function createStaffInventory(formDataOrData: FormData | StaffInventoryInput) {
  try {
    const staffId = await getStaffId();

    let data: any = {};
    if (formDataOrData instanceof FormData) {
      const entries = Object.fromEntries(formDataOrData.entries());
      let parsedImages: string[] = [];
      try {
        parsedImages = JSON.parse((entries.images as string) || "[]");
      } catch {
        parsedImages = [];
      }

      const areaNum = entries.area ? parseFloat(entries.area as string) : null;
      const priceNum = entries.price ? parseFloat(entries.price as string) : null;
      const bedsNum = entries.bedrooms ? parseInt(entries.bedrooms as string) : null;
      const bathsNum = entries.bathrooms ? parseInt(entries.bathrooms as string) : null;

      data = {
        title: (entries.title as string) || (entries.address as string) || "Inventory Item",
        price: priceNum,
        city: (entries.city as string) || "Rawalpindi",
        society: (entries.society as string) || null,
        phase: (entries.phase as string) || null,
        type: (entries.type as string) || "SALE",
        purpose: (entries.type as string) || "Sale",
        category: (entries.category as string) || "HOUSE",
        propertyType: (entries.category as string) || "House",
        status: (entries.status as string) || "AVAILABLE",
        label: (entries.label as string) || "NONE",
        address: (entries.address as string) || "",
        street: (entries.street as string) || (entries.address as string) || null,
        plotNo: (entries.plotNo as string) || null,
        number: (entries.number as string) || null,
        bedrooms: bedsNum,
        bathrooms: bathsNum,
        area: areaNum,
        areaUnit: (entries.areaUnit as string) || "MARLA",
        size: entries.area ? (entries.area as string) : null,
        sizeUnit: (entries.areaUnit as string) || "Marla",
        description: (entries.description as string) || null,
        detail: (entries.description as string) || null,
        images: parsedImages,
        contact: (entries.contact as string) || null,
        comment: (entries.comment as string) || null,
      };
    } else {
      data = {
        title: formDataOrData.title || "Inventory Item",
        price: typeof formDataOrData.price === "number" ? formDataOrData.price : formDataOrData.price ? parseFloat(formDataOrData.price) : null,
        city: formDataOrData.city || "Rawalpindi",
        society: formDataOrData.society || null,
        phase: formDataOrData.phase || null,
        type: formDataOrData.type || formDataOrData.purpose || "SALE",
        purpose: formDataOrData.purpose || formDataOrData.type || "Sale",
        category: formDataOrData.category || formDataOrData.propertyType || "HOUSE",
        propertyType: formDataOrData.propertyType || formDataOrData.category || "House",
        status: formDataOrData.status || "AVAILABLE",
        label: formDataOrData.label || "NONE",
        address: formDataOrData.address || formDataOrData.street || "",
        street: formDataOrData.street || formDataOrData.address || null,
        plotNo: formDataOrData.plotNo || null,
        number: formDataOrData.number || null,
        bedrooms: formDataOrData.bedrooms || null,
        bathrooms: formDataOrData.bathrooms || null,
        area: formDataOrData.area || (formDataOrData.size ? parseFloat(formDataOrData.size) : null),
        areaUnit: formDataOrData.areaUnit || formDataOrData.sizeUnit || "MARLA",
        size: formDataOrData.size || (formDataOrData.area ? String(formDataOrData.area) : null),
        sizeUnit: formDataOrData.sizeUnit || formDataOrData.areaUnit || "Marla",
        description: formDataOrData.description || formDataOrData.detail || null,
        detail: formDataOrData.detail || formDataOrData.description || null,
        images: formDataOrData.images || [],
        contact: formDataOrData.contact || null,
        comment: formDataOrData.comment || null,
      };
    }

    const item = await prisma.staffInventory.create({
      data: {
        ...data,
        createdById: staffId,
      },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
    });

    revalidatePath("/staff/inventory");
    return { success: true, item };
  } catch (error: any) {
    console.error("Error creating inventory item:", error);
    return { success: false, error: error.message || "Failed to create inventory item." };
  }
}

export async function updateStaffInventory(id: string, formDataOrData: FormData | StaffInventoryInput) {
  try {
    const staffId = await getStaffId();
    const existing = await prisma.staffInventory.findFirst({
      where: { id, createdById: staffId },
    });

    if (!existing) {
      return { success: false, error: "Record not found or access denied." };
    }

    let data: any = {};
    if (formDataOrData instanceof FormData) {
      const entries = Object.fromEntries(formDataOrData.entries());
      let parsedImages = existing.images || [];
      if (entries.images) {
        try {
          parsedImages = JSON.parse(entries.images as string);
        } catch {
          // preserve existing
        }
      }

      const areaNum = entries.area ? parseFloat(entries.area as string) : null;
      const priceNum = entries.price ? parseFloat(entries.price as string) : null;
      const bedsNum = entries.bedrooms ? parseInt(entries.bedrooms as string) : null;
      const bathsNum = entries.bathrooms ? parseInt(entries.bathrooms as string) : null;

      data = {
        title: (entries.title as string) || existing.title,
        price: priceNum !== null ? priceNum : existing.price,
        city: (entries.city as string) || existing.city,
        society: (entries.society as string) || null,
        phase: (entries.phase as string) || null,
        type: (entries.type as string) || existing.type,
        purpose: (entries.type as string) || existing.purpose,
        category: (entries.category as string) || existing.category,
        propertyType: (entries.category as string) || existing.propertyType,
        status: (entries.status as string) || existing.status,
        label: (entries.label as string) || existing.label,
        address: (entries.address as string) || existing.address,
        street: (entries.street as string) || (entries.address as string) || existing.street,
        plotNo: (entries.plotNo as string) || existing.plotNo,
        number: (entries.number as string) || existing.number,
        bedrooms: bedsNum,
        bathrooms: bathsNum,
        area: areaNum,
        areaUnit: (entries.areaUnit as string) || existing.areaUnit,
        size: entries.area ? (entries.area as string) : existing.size,
        sizeUnit: (entries.areaUnit as string) || existing.sizeUnit,
        description: (entries.description as string) || null,
        detail: (entries.description as string) || null,
        images: parsedImages,
        contact: (entries.contact as string) || existing.contact,
        comment: (entries.comment as string) || existing.comment,
      };
    } else {
      data = {
        title: formDataOrData.title !== undefined ? formDataOrData.title : existing.title,
        price: formDataOrData.price !== undefined ? (typeof formDataOrData.price === "number" ? formDataOrData.price : formDataOrData.price ? parseFloat(formDataOrData.price) : null) : existing.price,
        city: formDataOrData.city !== undefined ? formDataOrData.city : existing.city,
        society: formDataOrData.society !== undefined ? formDataOrData.society : existing.society,
        phase: formDataOrData.phase !== undefined ? formDataOrData.phase : existing.phase,
        type: formDataOrData.type || formDataOrData.purpose || existing.type,
        purpose: formDataOrData.purpose || formDataOrData.type || existing.purpose,
        category: formDataOrData.category || formDataOrData.propertyType || existing.category,
        propertyType: formDataOrData.propertyType || formDataOrData.category || existing.propertyType,
        status: formDataOrData.status !== undefined ? formDataOrData.status : existing.status,
        label: formDataOrData.label !== undefined ? formDataOrData.label : existing.label,
        address: formDataOrData.address !== undefined ? formDataOrData.address : existing.address,
        street: formDataOrData.street !== undefined ? formDataOrData.street : existing.street,
        plotNo: formDataOrData.plotNo !== undefined ? formDataOrData.plotNo : existing.plotNo,
        number: formDataOrData.number !== undefined ? formDataOrData.number : existing.number,
        bedrooms: formDataOrData.bedrooms !== undefined ? formDataOrData.bedrooms : existing.bedrooms,
        bathrooms: formDataOrData.bathrooms !== undefined ? formDataOrData.bathrooms : existing.bathrooms,
        area: formDataOrData.area !== undefined ? formDataOrData.area : existing.area,
        areaUnit: formDataOrData.areaUnit || formDataOrData.sizeUnit || existing.areaUnit,
        size: formDataOrData.size !== undefined ? formDataOrData.size : existing.size,
        sizeUnit: formDataOrData.sizeUnit || formDataOrData.areaUnit || existing.sizeUnit,
        description: formDataOrData.description !== undefined ? formDataOrData.description : existing.description,
        detail: formDataOrData.detail !== undefined ? formDataOrData.detail : existing.detail,
        images: formDataOrData.images !== undefined ? formDataOrData.images : existing.images,
        contact: formDataOrData.contact !== undefined ? formDataOrData.contact : existing.contact,
        comment: formDataOrData.comment !== undefined ? formDataOrData.comment : existing.comment,
      };
    }

    const updated = await prisma.staffInventory.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
    });

    revalidatePath("/staff/inventory");
    return { success: true, item: updated };
  } catch (error: any) {
    console.error("Error updating inventory:", error);
    return { success: false, error: error.message || "Failed to update inventory." };
  }
}

export async function createStaffInventoryItem(data?: StaffInventoryInput) {
  return createStaffInventory(data || {});
}

export async function updateStaffInventoryCell(
  id: string,
  field: string,
  value: string | number | null
) {
  try {
    const staffId = await getStaffId();
    const existing = await prisma.staffInventory.findFirst({
      where: { id, createdById: staffId },
    });

    if (!existing) {
      return { success: false, error: "Record not found or access denied." };
    }

    let processedValue: any = value;
    if (field === "price" || field === "area") {
      processedValue = value ? parseFloat(value.toString()) : null;
    } else if (field === "bedrooms" || field === "bathrooms") {
      processedValue = value ? parseInt(value.toString()) : null;
    }

    const updateData: any = {
      [field]: processedValue,
    };

    // Keep aliases synchronized
    if (field === "category") updateData.propertyType = value;
    if (field === "propertyType") updateData.category = value;
    if (field === "type") updateData.purpose = value;
    if (field === "purpose") updateData.type = value;
    if (field === "area") updateData.size = value ? String(value) : null;
    if (field === "size") updateData.area = value ? parseFloat(value.toString()) : null;
    if (field === "areaUnit") updateData.sizeUnit = value;
    if (field === "sizeUnit") updateData.areaUnit = value;
    if (field === "description") updateData.detail = value;
    if (field === "detail") updateData.description = value;
    if (field === "address") updateData.street = value;
    if (field === "street") updateData.address = value;

    const updated = await prisma.staffInventory.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
    });

    revalidatePath("/staff/inventory");
    return { success: true, item: updated };
  } catch (error: any) {
    console.error("Error updating inventory cell:", error);
    return { success: false, error: error.message || "Failed to update cell." };
  }
}

export async function updateStaffInventoryRow(
  id: string,
  data: StaffInventoryInput
) {
  return updateStaffInventory(id, data);
}

export async function deleteStaffInventoryItem(id: string) {
  try {
    const staffId = await getStaffId();
    const existing = await prisma.staffInventory.findFirst({
      where: { id, createdById: staffId },
    });

    if (!existing) {
      return { success: false, error: "Record not found or access denied." };
    }

    await prisma.staffInventory.delete({
      where: { id },
    });

    revalidatePath("/staff/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting inventory item:", error);
    return { success: false, error: error.message || "Failed to delete item." };
  }
}
