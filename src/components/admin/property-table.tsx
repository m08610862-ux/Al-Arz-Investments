"use client";

import { useState } from "react";
import { Trash2, Eye, EyeOff, Flame, Rocket } from "lucide-react";
import { deleteProperty, reassignProperty, adminTogglePropertyActiveStatus } from "@/app/actions/admin-properties";
import Link from "next/link";

type Staff = { id: string; name: string };

type PropertyList = {
  id: string;
  title: string;
  price: number;
  city: string;
  type: string;
  status: string;
  isActive: boolean;
  label: string;
  assignedTo: Staff | null;
  createdBy: Staff;
};

export function PropertyTable({ 
  properties, 
  staffList 
}: { 
  properties: PropertyList[];
  staffList: Staff[];
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);


  const handleToggleActive = async (id: string, currentlyActive: boolean) => {
    setLoadingId(id);
    await adminTogglePropertyActiveStatus(id, !currentlyActive);
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property? This will also delete any linked inventory units and leads cannot be linked to it anymore.")) {
      setLoadingId(id);
      await deleteProperty(id);
      setLoadingId(null);
    }
  };

  const handleReassign = async (propertyId: string, newStaffId: string) => {
    setLoadingId(propertyId);
    await reassignProperty(propertyId, newStaffId);
    setLoadingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Property Management</h1>
        <Link
          href="/staff/properties"
          className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary-700 shadow-sm"
        >
          Create Listing
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-900 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-4 font-semibold w-24 text-center">Visible</th>
                <th className="px-6 py-4 font-semibold min-w-[200px]">Title & Location</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Type & Status</th>
                <th className="px-6 py-4 font-semibold">Assigned Agent</th>
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
                      title={property.isActive ? "Click to hide from public" : "Click to show on public site"}
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
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-neutral-900 truncate max-w-[250px]">{property.title}</p>
                      {property.label === "SUPER_HOT" && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 rounded"><Rocket className="h-3 w-3" /> Super Hot</span>}
                      {property.label === "HOT" && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600 rounded"><Flame className="h-3 w-3" /> Hot</span>}
                    </div>
                    <p className="text-xs text-neutral-500">{property.city}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    Rs {property.price.toLocaleString("en-PK")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-semibold bg-neutral-100 px-2 py-0.5 rounded">{property.type}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        property.status === "AVAILABLE" ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-700"
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      disabled={loadingId === property.id}
                      value={property.assignedTo?.id || ""}
                      onChange={(e) => handleReassign(property.id, e.target.value)}
                      className="block w-full rounded-md border-neutral-300 bg-neutral-50 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 px-2 py-1"
                    >
                      <option value="" disabled>Select Staff</option>
                      {staffList.map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.name}</option>
                      ))}
                    </select>
                    {!property.assignedTo && (
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Default: {property.createdBy.name}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    <Link
                      href={`/properties/${property.id}`}
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                      target="_blank"
                    >
                      View
                    </Link>
                    <button
                      disabled={loadingId === property.id}
                      onClick={() => handleDelete(property.id)}
                      className="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                    No properties found globally.
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
