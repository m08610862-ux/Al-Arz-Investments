"use client";

import { useState, useMemo } from "react";
import {
  Edit2,
  Ban,
  CheckCircle2,
  UserPlus,
  Trash2,
  Users,
  Search,
  X,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  FileSpreadsheet,
  ShieldCheck,
  Briefcase,
  Layers,
} from "lucide-react";
import { StaffModal } from "./staff-modal";
import { toggleStaffStatus, deleteStaff } from "@/app/actions/admin-staff";
import Image from "next/image";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image?: string | null;
  isActive: boolean;
  designation: string | null;
  createdAt: Date;
  _count?: {
    createdProperties: number;
    assignedClients: number;
    staffInventories: number;
  };
};

function buildWhatsAppUrl(phone: string | null, name: string) {
  if (!phone) return null;
  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone) return null;
  const msg = `Hi ${name}, reaching out regarding Al-Arz Real Estate operations.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}

export function StaffTable({ staffList }: { staffList: StaffMember[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.isActive).length;
    const inactive = staffList.filter((s) => !s.isActive).length;
    const totalProps = staffList.reduce(
      (acc, s) => acc + (s._count?.createdProperties || 0),
      0
    );
    const totalClients = staffList.reduce(
      (acc, s) => acc + (s._count?.assignedClients || 0),
      0
    );
    return { total, active, inactive, totalProps, totalClients };
  }, [staffList]);

  // Filtered staff list
  const filtered = useMemo(() => {
    return staffList.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone && s.phone.includes(q)) ||
        (s.designation && s.designation.toLowerCase().includes(q));

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && s.isActive) ||
        (statusFilter === "INACTIVE" && !s.isActive);

      return matchSearch && matchStatus;
    });
  }, [staffList, search, statusFilter]);

  const handleCreate = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (
      confirm(
        `Are you sure you want to ${
          currentStatus ? "deactivate" : "activate"
        } this staff account?`
      )
    ) {
      setLoadingId(id);
      await toggleStaffStatus(id, !currentStatus);
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(
        `Are you absolutely sure you want to delete ${name}?\n\nTheir assigned properties and clients will be safely reassigned to you.`
      )
    ) {
      setLoadingId(id);
      await deleteStaff(id);
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Bar ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-accent-500 flex items-center justify-center text-white shadow-md shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-primary-900 tracking-tight">
              Staff &amp; Advisor Management
            </h1>
            <p className="text-xs text-primary-500 mt-0.5">
              Manage licensed real estate advisors, login credentials, and account activation.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-accent-500 hover:bg-accent-600 rounded-xl transition-colors shadow-sm cursor-pointer self-start md:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* ── KPI Summary Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Staff */}
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "ALL"
              ? "bg-accent-500 text-white border-accent-600 shadow-sm"
              : "bg-white text-primary-900 border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
              Total Advisors
            </span>
            <Users className="h-4 w-4 opacity-75" />
          </div>
          <p className="text-2xl font-black mt-2">{stats.total}</p>
        </button>

        {/* Active Advisors */}
        <button
          onClick={() => setStatusFilter("ACTIVE")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "ACTIVE"
              ? "bg-accent-500 text-white border-accent-600 shadow-sm"
              : "bg-white text-primary-900 border-neutral-200 hover:border-accent-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-600">
              Active Access
            </span>
            <CheckCircle2 className="h-4 w-4 text-accent-500" />
          </div>
          <p className="text-2xl font-black mt-2">{stats.active}</p>
        </button>

        {/* Inactive / Suspended */}
        <button
          onClick={() => setStatusFilter("INACTIVE")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "INACTIVE"
              ? "bg-accent-500 text-white border-accent-600 shadow-sm"
              : "bg-white text-primary-900 border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
              Deactivated
            </span>
            <Ban className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-black mt-2">{stats.inactive}</p>
        </button>

        {/* Properties Managed */}
        <div className="p-4 rounded-2xl border border-neutral-200 bg-white text-primary-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-500">
              Team Properties
            </span>
            <Building2 className="h-4 w-4 text-primary-400" />
          </div>
          <p className="text-2xl font-black mt-2">{stats.totalProps}</p>
        </div>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search advisor by name, email, phone, or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs font-medium text-primary-900 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white transition-all placeholder:text-neutral-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs font-semibold text-neutral-700 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent-500 cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="ACTIVE">Active Staff</option>
            <option value="INACTIVE">Deactivated Staff</option>
          </select>

          {(search || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="h-9 px-3 inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Structured Staff Table ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-primary-700 border-collapse select-text">
            <thead className="bg-neutral-100/90 text-primary-900 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 min-w-[220px]">Advisor Profile</th>
                <th className="px-5 py-3.5 min-w-[200px]">Contact &amp; WhatsApp</th>
                <th className="px-4 py-3.5 min-w-[170px]">Portfolio Activity</th>
                <th className="px-4 py-3.5 min-w-[120px]">Account Status</th>
                <th className="px-4 py-3.5 text-right min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-sans">
              {filtered.map((staff) => {
                const initial = (staff.name || "A").charAt(0).toUpperCase();
                const waUrl = buildWhatsAppUrl(staff.phone, staff.name);

                return (
                  <tr
                    key={staff.id}
                    className={`hover:bg-neutral-50/70 transition-colors group ${
                      !staff.isActive ? "opacity-60 bg-neutral-50/30" : ""
                    }`}
                  >
                    {/* Advisor Profile */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-accent-50 text-accent-700 border border-accent-100 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden relative shadow-xs">
                          {staff.image ? (
                            <Image
                              src={staff.image}
                              alt={staff.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <span>{initial}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-primary-900 text-xs truncate">
                            {staff.name}
                          </p>
                          <p className="text-[11px] text-accent-600 font-semibold truncate mt-0.5">
                            {staff.designation || "Property Consultant"}
                          </p>
                          <p className="text-[10px] text-primary-400 mt-0.5">
                            Joined:{" "}
                            {new Date(staff.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact & WhatsApp */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-primary-700">
                          <Mail className="h-3 w-3 text-primary-400 shrink-0" />
                          <a
                            href={`mailto:${staff.email}`}
                            className="text-xs hover:text-accent-500 truncate"
                          >
                            {staff.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary-700">
                          <Phone className="h-3 w-3 text-primary-400 shrink-0" />
                          {staff.phone ? (
                            <a
                              href={`tel:${staff.phone}`}
                              className="text-xs font-mono hover:text-accent-500"
                            >
                              {staff.phone}
                            </a>
                          ) : (
                            <span className="text-[10px] text-primary-400 italic">No phone</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Portfolio Activity */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-primary-800 font-bold border border-neutral-200">
                          <Building2 className="h-3 w-3 text-primary-500" />
                          {staff._count?.createdProperties || 0} Listings
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-50 text-accent-700 font-bold border border-accent-100">
                          <Users className="h-3 w-3 text-accent-500" />
                          {staff._count?.assignedClients || 0} Leads
                        </span>
                      </div>
                    </td>

                    {/* Account Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                          staff.isActive
                            ? "bg-accent-50 text-accent-700 border-accent-200"
                            : "bg-neutral-100 text-neutral-500 border-neutral-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            staff.isActive ? "bg-accent-500 animate-pulse" : "bg-neutral-400"
                          }`}
                        />
                        {staff.isActive ? "Active Portal" : "Deactivated"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right whitespace-nowrap space-x-1.5">
                      {/* WhatsApp */}
                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-accent-700 bg-accent-50 hover:bg-accent-100 border border-accent-200 transition-colors"
                          title="Open WhatsApp chat"
                        >
                          <MessageCircle className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(staff)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-primary-700 hover:bg-neutral-100 border border-neutral-200 transition-colors cursor-pointer"
                        title="Edit profile"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>

                      {/* Toggle Status */}
                      <button
                        disabled={loadingId === staff.id}
                        onClick={() => handleToggleStatus(staff.id, staff.isActive)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border disabled:opacity-50 ${
                          staff.isActive
                            ? "text-primary-600 bg-neutral-100 hover:bg-neutral-200 border-neutral-300"
                            : "text-accent-700 bg-accent-50 hover:bg-accent-100 border-accent-200"
                        }`}
                        title={staff.isActive ? "Deactivate account" : "Activate account"}
                      >
                        {staff.isActive ? <Ban className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        <span>{staff.isActive ? "Disable" : "Enable"}</span>
                      </button>

                      {/* Delete */}
                      <button
                        disabled={loadingId === staff.id}
                        onClick={() => handleDelete(staff.id, staff.name)}
                        className="p-1 text-primary-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer disabled:opacity-40"
                        title="Delete staff account"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-primary-400 bg-neutral-50/30">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-neutral-300" />
                      <p className="font-semibold text-xs text-primary-700">
                        {staffList.length === 0
                          ? "No staff members created yet. Click 'Add Staff Member' to get started."
                          : "No staff members match the applied filters."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-[11px] text-primary-500">
          <span className="font-bold">Total Staff Accounts: {staffList.length}</span>
          <span>
            Showing {filtered.length} of {staffList.length} staff members
          </span>
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
