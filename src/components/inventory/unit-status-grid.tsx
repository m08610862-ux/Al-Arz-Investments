"use client";

import { InventoryStatus } from "@prisma/client";

type Unit = {
  id: string;
  unitNumber: string;
  floor: number | null;
  area: number | null;
  price: number | null;
  status: InventoryStatus;
};

const STATUS_CONFIG: Record<InventoryStatus, { label: string; bg: string; text: string; dot: string }> = {
  AVAILABLE: { label: "Available", bg: "bg-blue-100 hover:bg-blue-200 border-blue-300", text: "text-blue-800", dot: "bg-blue-500" },
  RESERVED:  { label: "Reserved",  bg: "bg-neutral-100 hover:bg-neutral-200 border-neutral-300", text: "text-neutral-600", dot: "bg-neutral-400" },
  SOLD:      { label: "Sold",      bg: "bg-neutral-800 border-neutral-900", text: "text-neutral-100", dot: "bg-neutral-400" },
  RENTED:    { label: "Rented",    bg: "bg-purple-100 hover:bg-purple-200 border-purple-300", text: "text-purple-800", dot: "bg-purple-500" },
};

function formatPrice(price: number | null) {
  if (!price) return null;
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(price);
}

export function UnitStatusGrid({ units }: { units: Unit[] }) {
  if (units.length === 0) return null;

  const totalUnits = units.length;
  const availableCount = units.filter((u) => u.status === "AVAILABLE").length;
  const soldCount = units.filter((u) => u.status === "SOLD").length;
  const reservedCount = units.filter((u) => u.status === "RESERVED").length;
  const rentedCount = units.filter((u) => u.status === "RENTED").length;

  // Group by floor for display
  const floors = [...new Set(units.map((u) => u.floor))].sort((a, b) => (b ?? 0) - (a ?? 0));
  const byFloor = floors.map((floor) => ({
    floor,
    units: units.filter((u) => u.floor === floor),
  }));

  return (
    <div>
      {/* Summary Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
        <span className="text-sm font-semibold text-neutral-700">
          {availableCount} of {totalUnits} units available
        </span>
        <div className="h-4 w-px bg-neutral-200" />
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const count = units.filter((u) => u.status === status).length;
          if (count === 0) return null;
          return (
            <div key={status} className="flex items-center gap-1.5 text-sm text-neutral-600">
              <span className={`inline-block h-3 w-3 rounded-full ${cfg.dot}`} />
              {cfg.label}: <strong>{count}</strong>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      {byFloor.length > 0 && byFloor[0].floor !== null ? (
        // Floor-grouped layout
        <div className="space-y-4">
          {byFloor.map(({ floor, units: floorUnits }) => (
            <div key={floor ?? "no-floor"}>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Floor {floor ?? "Ground"}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {floorUnits.map((unit) => {
                  const cfg = STATUS_CONFIG[unit.status];
                  return (
                    <div
                      key={unit.id}
                      title={`Unit ${unit.unitNumber}${unit.area ? ` · ${unit.area} sqft` : ""}${unit.price ? ` · ${formatPrice(unit.price)}` : ""}`}
                      className={`relative rounded-lg border p-2 text-center cursor-default transition-colors ${cfg.bg}`}
                    >
                      <p className={`text-xs font-bold ${cfg.text} truncate`}>{unit.unitNumber}</p>
                      <p className={`text-[10px] mt-0.5 ${cfg.text} opacity-80`}>{cfg.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Simple flat grid (no floors)
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {units.map((unit) => {
            const cfg = STATUS_CONFIG[unit.status];
            return (
              <div
                key={unit.id}
                title={`Unit ${unit.unitNumber}${unit.area ? ` · ${unit.area} sqft` : ""}${unit.price ? ` · ${formatPrice(unit.price)}` : ""}`}
                className={`rounded-lg border p-2 text-center cursor-default transition-colors ${cfg.bg}`}
              >
                <p className={`text-xs font-bold ${cfg.text} truncate`}>{unit.unitNumber}</p>
                <p className={`text-[10px] mt-0.5 ${cfg.text} opacity-80`}>{cfg.label}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
