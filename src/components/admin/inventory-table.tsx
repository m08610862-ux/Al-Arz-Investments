"use client";

import { useState } from "react";
import { updateInventoryStatus } from "@/app/actions/admin-inventory";
import { InventoryStatus } from "@prisma/client";
import { AlertTriangle, Home } from "lucide-react";

type InventoryList = {
  id: string;
  unitNumber: string;
  floor: number | null;
  status: InventoryStatus;
  property: { id: string; title: string };
};

const STATUS_COLORS: Record<InventoryStatus, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  RESERVED: "bg-yellow-100 text-yellow-700",
  SOLD: "bg-blue-100 text-blue-700",
  RENTED: "bg-purple-100 text-purple-700",
};

export function InventoryTable({ items }: { items: InventoryList[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: InventoryStatus) => {
    setLoadingId(id);
    await updateInventoryStatus(id, newStatus);
    setLoadingId(null);
  };

  // Group by property to easily calculate "Low Availability" alerts
  const availabilityByProperty = items.reduce((acc, item) => {
    if (!acc[item.property.id]) {
      acc[item.property.id] = { total: 0, available: 0, title: item.property.title };
    }
    acc[item.property.id].total++;
    if (item.status === "AVAILABLE") acc[item.property.id].available++;
    return acc;
  }, {} as Record<string, { total: number; available: number; title: string }>);

  const lowStockAlerts = Object.values(availabilityByProperty).filter(
    (p) => p.total > 1 && p.available <= 1 // Alert if multi-unit project has 1 or 0 available
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Inventory Management</h1>
      </div>

      {lowStockAlerts.length > 0 && (
        <div className="mb-8 rounded-xl bg-red-50 border border-red-200 p-4">
          <h3 className="text-red-800 font-bold flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            Low Availability Alerts
          </h3>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {lowStockAlerts.map((alert) => (
              <li key={alert.title}>
                <strong>{alert.title}</strong> only has {alert.available} unit(s) available out of {alert.total}.
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-900 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-semibold min-w-[200px]">Parent Project / Property</th>
                <th className="px-6 py-4 font-semibold">Unit Number</th>
                <th className="px-6 py-4 font-semibold">Floor</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-neutral-400" />
                      <span className="font-semibold text-neutral-900">{item.property.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {item.unitNumber}
                  </td>
                  <td className="px-6 py-4">
                    {item.floor !== null ? `Floor ${item.floor}` : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      disabled={loadingId === item.id}
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as InventoryStatus)}
                      className={`text-xs font-semibold px-2 py-1 rounded border-0 ring-1 ring-inset ${STATUS_COLORS[item.status]} cursor-pointer`}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="RESERVED">Reserved</option>
                      <option value="SOLD">Sold</option>
                      <option value="RENTED">Rented</option>
                    </select>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    No inventory units found globally.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
