import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { InventoryTable } from "@/components/admin/inventory-table";
import { InventoryManager } from "@/components/inventory/inventory-manager";
import { UnitStatusGrid } from "@/components/inventory/unit-status-grid";

export default async function MyInventoryPage() {
  const session = await requireAuth();
  const staffId = session.user.id;

  // DATA ISOLATION: only fetch properties this staff manages
  const myProperties = await prisma.property.findMany({
    where: {
      OR: [{ createdById: staffId }, { assignedToId: staffId }],
    },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      inventory: {
        orderBy: [{ floor: "asc" }, { unitNumber: "asc" }],
        select: { id: true, unitNumber: true, floor: true, area: true, price: true, status: true },
      },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">My Inventory</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Manage units for your properties. Changes automatically update the property&apos;s overall status.
        </p>
      </div>

      {myProperties.length === 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-500">
          You have no properties yet. Add a property first, then manage its units here.
        </div>
      )}

      <div className="space-y-8">
        {myProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="font-bold text-neutral-900">{property.title}</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {property.inventory.length} unit{property.inventory.length !== 1 ? "s" : ""} total
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Visual grid */}
              {property.inventory.length > 0 && (
                <UnitStatusGrid units={property.inventory} />
              )}

              {/* Management table */}
              <InventoryManager propertyId={property.id} units={property.inventory} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
