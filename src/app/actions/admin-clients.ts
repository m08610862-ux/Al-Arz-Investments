"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ClientStatus, LeadSource } from "@prisma/client";

export async function reassignLead(clientId: string, staffId: string) {
  try {
    await requireAdmin();
    await prisma.client.update({
      where: { id: clientId },
      data: { assignedStaffId: staffId },
    });
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateLeadStatus(clientId: string, status: ClientStatus) {
  try {
    await requireAdmin();
    await prisma.client.update({
      where: { id: clientId },
      data: { status },
    });
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLead(clientId: string) {
  try {
    await requireAdmin();
    await prisma.client.delete({ where: { id: clientId } });
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminCreateLead(data: {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: LeadSource;
  status: ClientStatus;
  assignedStaffId?: string;
  propertyId?: string;
  notes?: string;
}) {
  try {
    await requireAdmin();
    await prisma.client.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message || null,
        source: data.source,
        status: data.status,
        assignedStaffId: data.assignedStaffId || null,
        propertyId: data.propertyId || null,
        notes: data.notes || null,
      },
    });
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
export async function adminUpdateLeadNotes(clientId: string, notes: string) {
  try {
    await requireAdmin();
    await prisma.client.update({ where: { id: clientId }, data: { notes } });
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
