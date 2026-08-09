"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, Star, Eye, EyeOff, Flame, Rocket } from "lucide-react";
import { PropertyModal } from "./property-modal";
import { deleteProperty, togglePropertyActiveStatus } from "@/app/actions/staff-properties";

type Property = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: string;
  category: string;
  address: string;
  city: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  featured: boolean;
  isActive: boolean;
  label: string;
  images: string[];
};

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  SOLD: "bg-blue-100 text-blue-700",
  RENTED: "bg-purple-100 text-purple-700",
  RESERVED: "bg-yellow-100 text-yellow-700",
};

export function MyPropertiesTable({ properties }: { properties: Property[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    setLoadingId(id);
    const fd = new FormData();
    fd.append("id", id);
    await deleteProperty(fd);
    setLoadingId(null);
  };

  const handleToggleActive = async (id: string, currentlyActive: boolean) => {
    setLoadingId(id);
    await togglePropertyActiveStatus(id, !currentlyActive);
    setLoadingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">My Properties</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-900 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-4 font-semibold w-28 text-center">Visibility</th>
                <th className="px-6 py-4 font-semibold min-w-[200px]">Property</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {properties.map((property) => (
                <tr key={property.id} className={`hover:bg-neutral-50 transition-colors ${!property.isActive ? "opacity-50" : ""}`}>


                  {/* Active/Inactive Toggle */}
                  <td className="px-4 py-4 text-center">
                    <button
                      disabled={loadingId === property.id}
                      onClick={() => handleToggleActive(property.id, property.isActive)}
                      title={property.isActive ? "Click to hide from public site" : "Click to show on public site"}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                        property.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      {property.isActive ? (
                        <><Eye className="h-3.5 w-3.5" /> Live</>
                      ) : (
                        <><EyeOff className="h-3.5 w-3.5" /> Hidden</>
                      )}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-neutral-900 text-base truncate">{property.title}</h3>
                      {property.label === "SUPER_HOT" && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 rounded whitespace-nowrap shrink-0"><Rocket className="h-3 w-3" /> Super Hot</span>}
                      {property.label === "HOT" && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600 rounded whitespace-nowrap shrink-0"><Flame className="h-3 w-3" /> Hot</span>}
                    </div>
                    <p className="text-xs text-neutral-500">{property.city} · {property.category}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    Rs {property.price.toLocaleString("en-PK")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                      {property.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[property.status] || "bg-neutral-100 text-neutral-700"}`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(property)}
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      disabled={loadingId === property.id}
                      onClick={() => handleDelete(property.id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                    You have no properties yet. Click &quot;Add Property&quot; to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={editingProperty}
      />
    </div>
  );
}
