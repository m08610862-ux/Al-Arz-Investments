"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ClientStatus, LeadSource } from "@prisma/client";

async function getStaffId() {
  const session = await requireAuth();
  return session.user.id;
}

export async function updateClientStatus(clientId: string, status: ClientStatus) {
  try {
    const staffId = await getStaffId();
    const existing = await prisma.client.findFirst({
      where: { id: clientId, assignedStaffId: staffId },
    });
    if (!existing) return { success: false, error: "Access denied." };
    await prisma.client.update({ where: { id: clientId }, data: { status } });
    revalidatePath("/staff/clients");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateClientNotes(clientId: string, notes: string) {
  try {
    const staffId = await getStaffId();
    const existing = await prisma.client.findFirst({
      where: { id: clientId, assignedStaffId: staffId },
    });
    if (!existing) return { success: false, error: "Access denied." };
    await prisma.client.update({ where: { id: clientId }, data: { notes } });
    revalidatePath("/staff/clients");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function staffDeleteLead(clientId: string) {
  try {
    const staffId = await getStaffId();
    const existing = await prisma.client.findFirst({
      where: { id: clientId, assignedStaffId: staffId },
    });
    if (!existing) return { success: false, error: "Access denied." };
    await prisma.client.delete({ where: { id: clientId } });
    revalidatePath("/staff/clients");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function staffCreateLead(data: {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: LeadSource;
  status: ClientStatus;
  propertyId?: string;
  notes?: string;
}) {
  try {
    const staffId = await getStaffId();
    await prisma.client.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message || null,
        source: data.source,
        status: data.status,
        assignedStaffId: staffId,
        propertyId: data.propertyId || null,
        notes: data.notes || null,
      },
    });
    revalidatePath("/staff/clients");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
