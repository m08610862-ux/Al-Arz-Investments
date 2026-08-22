"use client";

import React, { useState, useMemo } from "react";
import {
  Trash2,
  Plus,
  X,
  MessageCircle,
  Save,
  ChevronDown,
  Edit2,
  Users,
  Search,
  Building2,
  Phone,
  Mail,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import {
  reassignLead,
  updateLeadStatus,
  deleteLead,
  adminCreateLead,
  adminUpdateLead,
  adminUpdateLeadNotes,
} from "@/app/actions/admin-clients";
import { ClientStatus, LeadSource } from "@prisma/client";

type Staff = { id: string; name: string };
type Property = { id: string; title: string };

type LeadList = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  notes: string | null;
  source: LeadSource;
  status: ClientStatus;
  createdAt: Date;
  property: Property | null;
  assignedStaff: Staff | null;
};

// ── Refined Brand Theme Status Styles ─────────────────────────────────────────
const STATUS_CONFIG: Record<
  ClientStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  NEW: {
    label: "New Inquiry",
    bg: "bg-accent-50",
    text: "text-accent-700",
    border: "border-accent-200",
  },
  CONTACTED: {
    label: "Contacted",
    bg: "bg-primary-100",
    text: "text-primary-800",
    border: "border-primary-300",
  },
  NEGOTIATING: {
    label: "Negotiating",
    bg: "bg-neutral-100",
    text: "text-neutral-800",
    border: "border-neutral-300",
  },
  CLOSED: {
    label: "Closed (Won)",
    bg: "bg-accent-500",
    text: "text-white",
    border: "border-accent-600",
  },
  LOST: {
    label: "Closed (Lost)",
    bg: "bg-neutral-100",
    text: "text-neutral-500",
    border: "border-neutral-200",
  },
};

const SOURCE_LABELS: Record<LeadSource, string> = {
  WEBSITE: "Website Form",
  REFERRAL: "Referral",
  WALK_IN: "Walk-in",
  PHONE: "Direct Phone",
  SOCIAL_MEDIA: "Social Media",
  OTHER: "Other Source",
};

function buildWhatsAppUrl(phone: string, name: string, propertyTitle: string | null) {
  const cleanPhone = phone.replace(/\D/g, "");
  const msg = `Hi ${name}, I wanted to follow up regarding your inquiry${
    propertyTitle ? ` about *${propertyTitle}*` : ""
  }. Are you still interested? 😊\n\n_Al-Arz Investments_`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}

// ── Add / Edit Modal ─────────────────────────────────────────────────────────
function LeadModal({
  onClose,
  staffList,
  properties,
  lead,
}: {
  onClose: () => void;
  staffList: Staff[];
  properties: Property[];
  lead?: LeadList | null;
}) {
  const isEditing = Boolean(lead);
  const [form, setForm] = useState({
    name: lead?.name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    message: lead?.message || "",
    notes: lead?.notes || "",
    source: (lead?.source || "PHONE") as LeadSource,
    status: (lead?.status || "NEW") as ClientStatus,
    assignedStaffId: lead?.assignedStaff?.id || "",
    propertyId: lead?.property?.id || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and Phone number are required.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      let result;
      if (isEditing && lead) {
        result = await adminUpdateLead(lead.id, {
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          source: form.source,
          status: form.status,
          assignedStaffId: form.assignedStaffId || undefined,
          propertyId: form.propertyId || undefined,
        });
        if (result.success && form.notes !== lead.notes) {
          await adminUpdateLeadNotes(lead.id, form.notes);
        }
      } else {
        result = await adminCreateLead({
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          message: form.message || undefined,
          notes: form.notes || undefined,
          source: form.source,
          status: form.status,
          assignedStaffId: form.assignedStaffId || undefined,
          propertyId: form.propertyId || undefined,
        });
      }

      setSaving(false);
      if (!result.success) {
        setError(result.error || "Failed to save lead.");
        return;
      }
      onClose();
    } catch (err: any) {
      setSaving(false);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header matching Property Modal */}
        <div className="bg-accent-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-white" />
            <h2 className="text-base font-bold text-white tracking-tight">
              {isEditing ? "Edit Client Lead" : "Add New Client Lead"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                Client Name *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none transition-all"
                placeholder="e.g. Tariq Mehmood"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                Phone Number *
              </label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none transition-all"
                placeholder="0300-1234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none transition-all"
              placeholder="client@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                Lead Source
              </label>
              <select
                value={form.source}
                onChange={(e) => setForm((p) => ({ ...p, source: e.target.value as LeadSource }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none cursor-pointer"
              >
                {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                Pipeline Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ClientStatus }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none cursor-pointer"
              >
                <option value="NEW">New Inquiry</option>
                <option value="CONTACTED">Contacted</option>
                <option value="NEGOTIATING">Negotiating</option>
                <option value="CLOSED">Closed (Won)</option>
                <option value="LOST">Closed (Lost)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                Assign Staff Advisor
              </label>
              <select
                value={form.assignedStaffId}
                onChange={(e) => setForm((p) => ({ ...p, assignedStaffId: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none cursor-pointer"
              >
                <option value="">— Unassigned —</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
                Property of Interest
              </label>
              <select
                value={form.propertyId}
                onChange={(e) => setForm((p) => ({ ...p, propertyId: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none cursor-pointer truncate"
              >
                <option value="">— General Inquiry —</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-primary-700 mb-1 uppercase tracking-wide">
              Internal Remarks &amp; Notes
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-primary-900 focus:bg-white focus:ring-2 focus:ring-accent-500 outline-none resize-none"
              placeholder="Budget, preferred location, follow-up timeline..."
            />
          </div>

          <div className="flex gap-2.5 pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-bold text-primary-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-accent-500 hover:bg-accent-600 px-4 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-60 cursor-pointer shadow-sm"
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Admin ClientTable Component ─────────────────────────────────────────
export function ClientTable({
  leads,
  staffList,
  properties,
}: {
  leads: LeadList[];
  staffList: Staff[];
  properties: Property[];
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [modalLead, setModalLead] = useState<LeadList | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "NEW").length;
    const contacted = leads.filter((l) => l.status === "CONTACTED").length;
    const negotiating = leads.filter((l) => l.status === "NEGOTIATING").length;
    const closed = leads.filter((l) => l.status === "CLOSED").length;
    const lost = leads.filter((l) => l.status === "LOST").length;
    return { total, newCount, contacted, negotiating, closed, lost };
  }, [leads]);

  // Filtering
  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.property?.title && l.property.title.toLowerCase().includes(q)) ||
        (l.assignedStaff?.name && l.assignedStaff.name.toLowerCase().includes(q));

      const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
      const matchSource = sourceFilter === "ALL" || l.source === sourceFilter;
      return matchSearch && matchStatus && matchSource;
    });
  }, [leads, search, statusFilter, sourceFilter]);

  const handleReassign = async (clientId: string, newStaffId: string) => {
    setLoadingId(clientId);
    await reassignLead(clientId, newStaffId);
    setLoadingId(null);
  };

  const handleStatusChange = async (clientId: string, newStatus: ClientStatus) => {
    setLoadingId(clientId);
    await updateLeadStatus(clientId, newStatus);
    setLoadingId(null);
  };

  const handleDelete = async (clientId: string, name: string) => {
    if (!confirm(`Delete lead "${name}"? This cannot be undone.`)) return;
    setLoadingId(clientId);
    await deleteLead(clientId);
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {isModalOpen && (
        <LeadModal
          onClose={() => setIsModalOpen(false)}
          staffList={staffList}
          properties={properties}
          lead={modalLead}
        />
      )}

      {/* ── Top Header Bar ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-accent-500 flex items-center justify-center text-white shadow-md shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-primary-900 tracking-tight">
              Client &amp; Leads Management
            </h1>
            <p className="text-xs text-primary-500 mt-0.5">
              Track global inquiries, sales pipeline status, and assign leads to staff advisors.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setModalLead(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-accent-500 hover:bg-accent-600 rounded-xl transition-colors shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* ── Executive Pipeline Funnel Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* All Leads */}
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "ALL"
              ? "bg-accent-500 text-white border-accent-600 shadow-sm"
              : "bg-white text-primary-900 border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">All Leads</p>
          <p className="text-2xl font-black mt-1">{stats.total}</p>
        </button>

        {/* New */}
        <button
          onClick={() => setStatusFilter("NEW")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "NEW"
              ? "bg-accent-500 text-white border-accent-600 shadow-sm"
              : "bg-white text-primary-900 border-neutral-200 hover:border-accent-200"
          }`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-accent-600">New</p>
          <p className="text-2xl font-black mt-1">{stats.newCount}</p>
        </button>

        {/* Contacted */}
        <button
          onClick={() => setStatusFilter("CONTACTED")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "CONTACTED"
              ? "bg-accent-500 text-white border-accent-600 shadow-sm"
              : "bg-white text-primary-900 border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary-500">Contacted</p>
          <p className="text-2xl font-black mt-1">{stats.contacted}</p>
        </button>

        {/* Negotiating */}
        <button
          onClick={() => setStatusFilter("NEGOTIATING")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "NEGOTIATING"
              ? "bg-accent-500 text-white border-accent-600 shadow-sm"
              : "bg-white text-primary-900 border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary-700">Negotiating</p>
          <p className="text-2xl font-black mt-1">{stats.negotiating}</p>
        </button>

        {/* Closed Won */}
        <button
          onClick={() => setStatusFilter("CLOSED")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "CLOSED"
              ? "bg-accent-500 text-white border-accent-600 shadow-sm"
              : "bg-white text-primary-900 border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary-900 font-black">Closed (Won)</p>
          <p className="text-2xl font-black mt-1">{stats.closed}</p>
        </button>

        {/* Closed Lost */}
        <button
          onClick={() => setStatusFilter("LOST")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "LOST"
              ? "bg-accent-500 text-white border-accent-600 shadow-sm"
              : "bg-white text-primary-900 border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">Closed (Lost)</p>
          <p className="text-2xl font-black mt-1">{stats.lost}</p>
        </button>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search client name, phone, property, or assigned staff..."
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
            <option value="NEW">New Inquiries</option>
            <option value="CONTACTED">Contacted</option>
            <option value="NEGOTIATING">Negotiating</option>
            <option value="CLOSED">Closed (Won)</option>
            <option value="LOST">Closed (Lost)</option>
          </select>

          {/* Source Dropdown */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-9 px-3 text-xs font-semibold text-neutral-700 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent-500 cursor-pointer"
          >
            <option value="ALL">Source: All</option>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>

          {(search || statusFilter !== "ALL" || sourceFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
                setSourceFilter("ALL");
              }}
              className="h-9 px-3 inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Structured Leads Table ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-primary-700 border-collapse select-text">
            <thead className="bg-neutral-100/90 text-primary-900 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 min-w-[200px]">Client</th>
                <th className="px-5 py-3.5 min-w-[220px]">Property Interest / Inquiry</th>
                <th className="px-4 py-3.5 min-w-[120px]">Source</th>
                <th className="px-4 py-3.5 min-w-[130px]">Status</th>
                <th className="px-4 py-3.5 min-w-[150px]">Assigned Agent</th>
                <th className="px-4 py-3.5 text-right min-w-[130px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-sans">
              {filtered.map((lead) => {
                const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;
                const clientInitial = (lead.name || "C").charAt(0).toUpperCase();

                return (
                  <React.Fragment key={lead.id}>
                    <tr className="hover:bg-neutral-50/70 transition-colors group">
                      {/* Client Info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-700 border border-accent-100 flex items-center justify-center font-bold text-xs shrink-0">
                            {clientInitial}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-primary-900 text-xs truncate">
                              {lead.name}
                            </p>
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-[11px] font-mono text-accent-600 hover:underline block"
                            >
                              {lead.phone}
                            </a>
                            {lead.email && (
                              <p className="text-[10px] text-primary-400 truncate">{lead.email}</p>
                            )}
                            <p className="text-[10px] text-primary-400 mt-0.5">
                              {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Property Interest */}
                      <td className="px-5 py-3.5">
                        {lead.property ? (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-accent-500 shrink-0" />
                            <p className="font-bold text-primary-900 truncate max-w-[200px]" title={lead.property.title}>
                              {lead.property.title}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium text-primary-400 italic">
                            General Inquiry
                          </span>
                        )}
                        {lead.message && (
                          <p
                            className="text-[11px] text-primary-500 truncate max-w-[220px] mt-1 bg-neutral-50 p-1 rounded border border-neutral-100"
                            title={lead.message}
                          >
                            &ldquo;{lead.message}&rdquo;
                          </p>
                        )}
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block text-[11px] font-semibold text-primary-700 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                          {SOURCE_LABELS[lead.source]}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="px-4 py-3.5">
                        <select
                          disabled={loadingId === lead.id}
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as ClientStatus)}
                          className={`text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 cursor-pointer ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                        >
                          <option value="NEW" className="bg-white text-neutral-900">New Inquiry</option>
                          <option value="CONTACTED" className="bg-white text-neutral-900">Contacted</option>
                          <option value="NEGOTIATING" className="bg-white text-neutral-900">Negotiating</option>
                          <option value="CLOSED" className="bg-white text-neutral-900">Closed (Won)</option>
                          <option value="LOST" className="bg-white text-neutral-900">Closed (Lost)</option>
                        </select>
                      </td>

                      {/* Staff Assignment */}
                      <td className="px-4 py-3.5">
                        <select
                          disabled={loadingId === lead.id}
                          value={lead.assignedStaff?.id || ""}
                          onChange={(e) => handleReassign(lead.id, e.target.value)}
                          className="w-full text-xs font-semibold py-1 px-2 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 cursor-pointer"
                        >
                          <option value="">— Unassigned —</option>
                          {staffList.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                        {/* WhatsApp Direct Action */}
                        <a
                          href={buildWhatsAppUrl(lead.phone, lead.name, lead.property?.title ?? null)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-accent-700 bg-accent-50 hover:bg-accent-100 border border-accent-200 transition-colors"
                          title="Open WhatsApp chat"
                        >
                          <MessageCircle className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Notes Toggle */}
                        <button
                          onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            expandedId === lead.id
                              ? "bg-primary-800 text-white"
                              : "text-primary-600 hover:bg-neutral-100"
                          }`}
                          title="View / Edit Internal Notes"
                        >
                          <span>Notes</span>
                          <ChevronDown
                            className={`h-3 w-3 transition-transform ${
                              expandedId === lead.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Edit Modal */}
                        <button
                          onClick={() => {
                            setModalLead(lead);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-primary-400 hover:text-accent-500 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                          title="Edit Lead"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          disabled={loadingId === lead.id}
                          onClick={() => handleDelete(lead.id, lead.name)}
                          className="p-1 text-primary-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer disabled:opacity-40"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Notes Drawer */}
                    {expandedId === lead.id && (
                      <tr className="bg-neutral-50/80">
                        <td colSpan={6} className="px-6 py-4 border-b border-neutral-200">
                          <div className="max-w-2xl space-y-2">
                            <label className="block text-[11px] font-bold text-primary-700 uppercase tracking-wide">
                              Private Staff / Advisor Remarks
                            </label>
                            <textarea
                              rows={2}
                              className="w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-xs font-medium text-primary-900 focus:ring-2 focus:ring-accent-500 outline-none resize-none"
                              defaultValue={lead.notes ?? ""}
                              onChange={(e) =>
                                setEditingNotes((prev) => ({ ...prev, [lead.id]: e.target.value }))
                              }
                              placeholder="Type client preferences, discussion summary, or follow-up date..."
                            />
                            <button
                              onClick={async () => {
                                if (editingNotes[lead.id] === undefined) return;
                                setLoadingId(lead.id);
                                await adminUpdateLeadNotes(lead.id, editingNotes[lead.id]);
                                setLoadingId(null);
                              }}
                              disabled={loadingId === lead.id || editingNotes[lead.id] === undefined}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                            >
                              <Save className="h-3.5 w-3.5" />
                              <span>{loadingId === lead.id ? "Saving..." : "Save Notes"}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-primary-400 bg-neutral-50/30">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-neutral-300" />
                      <p className="font-semibold text-xs text-primary-700">
                        {leads.length === 0
                          ? "No client inquiries in the database yet."
                          : "No client inquiries match the applied filters."}
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
          <span className="font-bold">Total Inquiries: {leads.length}</span>
          <span>
            Showing {filtered.length} of {leads.length} leads
          </span>
        </div>
      </div>
    </div>
  );
}
