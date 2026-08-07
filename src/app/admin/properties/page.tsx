import prisma from "@/lib/prisma";
import { PropertyTable } from "@/components/admin/property-table";

export default async function AdminPropertiesPage() {

  // Fetch all properties
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      price: true,
      city: true,
      type: true,
      status: true,
      featured: true,
      isActive: true,
      label: true,
      assignedTo: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });

  // Fetch all staff members to allow reassignment
  const staff = await prisma.user.findMany({
    where: { role: "STAFF", isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PropertyTable properties={properties} staffList={staff} />
    </div>
  );
}
