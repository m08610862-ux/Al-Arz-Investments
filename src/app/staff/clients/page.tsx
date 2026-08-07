import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { MyClientsTable } from "@/components/staff/my-clients-table";

export default async function MyClientsPage() {
  const session = await requireAuth();
  const staffId = session.user.id;

  // DATA ISOLATION: only fetch leads assigned to this staff member
  const clients = await prisma.client.findMany({
    where: { assignedStaffId: staffId },
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
    },
  });

  // Fetch properties this staff member manages (for Add Lead modal)
  const properties = await prisma.property.findMany({
    where: {
      OR: [{ createdById: staffId }, { assignedToId: staffId }],
    },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return <MyClientsTable clients={clients} properties={properties} />;
}
