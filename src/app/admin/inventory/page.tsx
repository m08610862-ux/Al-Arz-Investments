import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { InventoryTable } from "@/components/staff/inventory-table";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const session = await requireAuth();

  // Admin access: fetch ALL inventory records across ALL staff members
  const allInventoryItems = await prisma.staffInventory.findMany({
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
      <InventoryTable
        initialData={allInventoryItems}
        canAdd={false}
      />
    </div>
  );
}
