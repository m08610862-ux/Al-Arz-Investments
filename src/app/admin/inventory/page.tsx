import prisma from "@/lib/prisma";
import { InventoryManager } from "@/components/inventory/inventory-manager";
import { UnitStatusGrid } from "@/components/inventory/unit-status-grid";

export default async function AdminInventoryPage() {

  // Fetch all properties to manage inventory
  const properties = await prisma.property.findMany({
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
        <h1 className="text-2xl font-bold text-neutral-900">Inventory Management</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Manage units for all properties globally. Changes automatically update the property&apos;s overall status.
        </p>
      </div>

      {properties.length === 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-500">
          No properties found. Add properties first, then manage their inventory units here.
        </div>
      )}

      <div className="space-y-8">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-neutral-900">{property.title}</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {property.inventory.length} unit{property.inventory.length !== 1 ? "s" : ""} total
                </p>
              </div>
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
