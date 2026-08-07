"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, ChevronDown } from "lucide-react";
import { InventoryStatus } from "@prisma/client";
import { addInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/app/actions/inventory";

type Unit = {
  id: string;
  unitNumber: string;
  floor: number | null;
  area: number | null;
  price: number | null;
  status: InventoryStatus;
};

const STATUS_OPTIONS: InventoryStatus[] = ["AVAILABLE", "RESERVED", "SOLD", "RENTED"];

const STATUS_COLORS: Record<InventoryStatus, string> = {
  AVAILABLE: "bg-blue-100 text-blue-700",
  RESERVED: "bg-neutral-100 text-neutral-600",
  SOLD: "bg-neutral-800 text-neutral-100",
  RENTED: "bg-purple-100 text-purple-700",
};

function UnitForm({
  propertyId,
  unit,
  onClose,
}: {
  propertyId: string;
  unit?: Unit | null;
  onClose: () => void;
}) {
  const isEdit = !!unit?.id;
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.append("propertyId", propertyId);
    if (isEdit) fd.append("id", unit.id);
    const action = isEdit ? updateInventoryItem : addInventoryItem;
    const result = await action(fd);
    if (!result.success) {
      setError(result.error || "Failed.");
      setSaving(false);
    } else {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-3">
      {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="label text-xs">Unit Number *</label>
          <input name="unitNumber" required defaultValue={unit?.unitNumber} className="input text-sm py-1.5" placeholder="e.g. A-101" />
        </div>
        <div>
          <label className="label text-xs">Floor</label>
          <input name="floor" type="number" defaultValue={unit?.floor ?? ""} className="input text-sm py-1.5" placeholder="e.g. 4" />
        </div>
        <div>
          <label className="label text-xs">Area (sqft)</label>
          <input name="area" type="number" defaultValue={unit?.area ?? ""} className="input text-sm py-1.5" placeholder="e.g. 950" />
        </div>
        <div>
          <label className="label text-xs">Price (PKR)</label>
          <input name="price" type="number" defaultValue={unit?.price ?? ""} className="input text-sm py-1.5" placeholder="e.g. 6500000" />
        </div>
      </div>

      {isEdit && (
        <div>
          <label className="label text-xs">Status</label>
          <select name="status" defaultValue={unit?.status} className="input text-sm py-1.5">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-700 disabled:opacity-70">
          {saving ? "Saving..." : isEdit ? "Save Unit" : "Add Unit"}
        </button>
      </div>
    </form>
  );
}

export function InventoryManager({
  propertyId,
  units,
}: {
  propertyId: string;
  units: Unit[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this unit?")) return;
    setLoadingId(id);
    await deleteInventoryItem(id);
    setLoadingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-neutral-900">Manage Units</h3>
        <button
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Unit
        </button>
      </div>

      {isAdding && (
        <div className="mb-4">
          <UnitForm propertyId={propertyId} onClose={() => setIsAdding(false)} />
        </div>
      )}

      {units.length === 0 && !isAdding && (
        <p className="text-sm text-neutral-500 text-center py-6 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
          No units added yet. Click "Add Unit" to get started.
        </p>
      )}

      <div className="space-y-2">
        {units.map((unit) => (
          <div key={unit.id}>
            {editingId === unit.id ? (
              <UnitForm
                propertyId={propertyId}
                unit={unit}
                onClose={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-200 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[unit.status]}`}>
                    {unit.status}
                  </span>
                  <span className="font-semibold text-sm text-neutral-900 truncate">{unit.unitNumber}</span>
                  {unit.floor !== null && <span className="text-xs text-neutral-500">Floor {unit.floor}</span>}
                  {unit.area && <span className="text-xs text-neutral-500">{unit.area} sqft</span>}
                  {unit.price && (
                    <span className="text-xs font-medium text-neutral-700">
                      Rs {unit.price.toLocaleString("en-PK")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingId(unit.id)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={loadingId === unit.id}
                    onClick={() => handleDelete(unit.id)}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
