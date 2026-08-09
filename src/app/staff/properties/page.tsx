import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { MyPropertiesTable } from "@/components/staff/my-properties-table";

export default async function MyPropertiesPage() {
  const session = await requireAuth();
  const staffId = session.user.id;

  // DATA ISOLATION: only fetch properties where this staff is creator OR assigned agent
  const properties = await prisma.property.findMany({
    where: {
      OR: [{ createdById: staffId }, { assignedToId: staffId }],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      type: true,
      category: true,
      address: true,
      city: true,
      status: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      society: true,
      phase: true,
      isActive: true,
      label: true,
      images: true,
    },
  });

  return <MyPropertiesTable properties={properties} />;
}
