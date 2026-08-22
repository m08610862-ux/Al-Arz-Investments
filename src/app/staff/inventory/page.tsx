import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { InventoryTable } from "@/components/staff/inventory-table";

export const dynamic = "force-dynamic";

export default async function StaffInventoryPage() {
  const session = await requireAuth();
  const staffId = session.user.id;

  // DATA ISOLATION: Fetch inventory records created by this staff member
  const inventoryItems = await prisma.staffInventory.findMany({
    where: {
      createdById: staffId,
    },
    include: {
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <InventoryTable initialData={inventoryItems} />
    </div>
  );
}
