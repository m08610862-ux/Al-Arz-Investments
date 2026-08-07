import prisma from "@/lib/prisma";
import { ClientTable } from "@/components/admin/client-table";

export default async function AdminClientsPage() {

  // Fetch all leads globally with full details
  const leads = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      message: true,
      notes: true,
      source: true,
      status: true,
      createdAt: true,
      property: { select: { id: true, title: true } },
      assignedStaff: { select: { id: true, name: true } },
    },
  });

  // Fetch all staff members for assignment
  const staff = await prisma.user.findMany({
    where: { role: "STAFF", isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Fetch all properties for the "Add Lead" modal
  const properties = await prisma.property.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return (
    <div>
      <ClientTable leads={leads} staffList={staff} properties={properties} />
    </div>
  );
}
