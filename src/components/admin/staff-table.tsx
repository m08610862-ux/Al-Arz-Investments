"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Ban, CheckCircle2, UserPlus, Trash2 } from "lucide-react";
import { StaffModal } from "./staff-modal";
import { toggleStaffStatus, deleteStaff } from "@/app/actions/admin-staff";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  designation: string | null;
  createdAt: Date;
};

export function StaffTable({ staffList }: { staffList: StaffMember[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const handleCreate = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (confirm(`Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this account?`)) {
      await toggleStaffStatus(id, !currentStatus);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to delete ${name}?\n\nTheir assigned properties and clients will be re-assigned to you.`)) {
      await deleteStaff(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Staff Management</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary-700 shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          Add Staff
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-900 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">WhatsApp / Phone</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-neutral-900">{staff.name}</p>
                    {staff.designation && (
                      <p className="text-xs text-primary-500 font-medium mt-0.5">{staff.designation}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">{staff.email}</td>
                  <td className="px-6 py-4">{staff.phone || <span className="text-neutral-400 italic">Not set</span>}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        staff.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {staff.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(staff.id, staff.isActive)}
                      className={`inline-flex items-center gap-1 font-medium ${
                        staff.isActive ? "text-amber-600 hover:text-amber-700" : "text-green-600 hover:text-green-700"
                      }`}
                    >
                      {staff.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      {staff.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id, staff.name)}
                      className="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staff={editingStaff as any}
      />
    </div>
  );
}
