"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createStaff(data: FormData) {
  try {
    await requireAdmin();

    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const designation = data.get("designation") as string;
    const password = data.get("password") as string;

    if (!name || !email || !password) {
      return { success: false, error: "Name, email, and password are required." };
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Email already in use." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        designation,
        password: hashedPassword,
        role: "STAFF",
        isActive: true,
      },
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to create staff." };
  }
}

export async function updateStaff(data: FormData) {
  try {
    await requireAdmin();

    const id = data.get("id") as string;
    const name = data.get("name") as string;
    const phone = data.get("phone") as string;
    const designation = data.get("designation") as string;

    if (!id || !name) {
      return { success: false, error: "Name is required." };
    }

    await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        designation,
      },
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to update staff." };
  }
}

export async function toggleStaffStatus(id: string, isActive: boolean) {
  try {
    await requireAdmin();

    await prisma.user.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to toggle status." };
  }
}

export async function deleteStaff(id: string) {
  try {
    const session = await requireAdmin();
    const adminId = session.user.id;

    if (id === adminId) {
      return { success: false, error: "You cannot delete yourself." };
    }

    // Re-assign properties created by this staff to the admin to prevent data loss / FK errors
    await prisma.property.updateMany({
      where: { createdById: id },
      data: { createdById: adminId },
    });

    // Unassign properties assigned to this staff
    await prisma.property.updateMany({
      where: { assignedToId: id },
      data: { assignedToId: null },
    });

    // Re-assign clients to the admin
    await prisma.client.updateMany({
      where: { assignedStaffId: id },
      data: { assignedStaffId: adminId },
    });

    // Delete the staff member
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/staff");
    revalidatePath("/admin/properties");
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to delete staff member." };
  }
}
