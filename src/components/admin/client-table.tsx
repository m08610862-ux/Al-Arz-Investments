"use client";

import { useState } from "react";
import { Trash2, Plus, X, MessageCircle, Save, ChevronDown } from "lucide-react";
import { reassignLead, updateLeadStatus, deleteLead, adminCreateLead, adminUpdateLeadNotes } from "@/app/actions/admin-clients";
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

const STATUS_COLORS: Record<ClientStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  NEGOTIATING: "bg-orange-100 text-orange-700",
  CLOSED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

const SOURCE_LABELS: Record<LeadSource, string> = {
  WEBSITE: "Website",
  REFERRAL: "Referral",
  WALK_IN: "Walk-in",
  PHONE: "Phone",
  SOCIAL_MEDIA: "Social Media",
  OTHER: "Other",
};

function buildWhatsAppUrl(phone: string, name: string, propertyTitle: string | null) {
  const cleanPhone = phone.replace(/\D/g, "");
  const msg = `Hi ${name}, I wanted to follow up regarding your inquiry${propertyTitle ? ` about *${propertyTitle}*` : ""}. Are you still interested? 😊\n\n_Al-Arz Investments_`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}

function AddLeadModal({
  onClose,
  staffList,
  properties,
}: {
  onClose: () => void;
  staffList: Staff[];
  properties: Property[];
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    notes: "",
    source: "PHONE" as LeadSource,
    status: "NEW" as ClientStatus,
    assignedStaffId: "",
    propertyId: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError("Name and Phone are required."); return; }
    setSaving(true);
    const result = await adminCreateLead({
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
    setSaving(false);
    if (!result.success) { setError(result.error || "Failed"); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900">Add New Lead</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Full Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Phone *</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="03001234567" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Email (optional)</label>
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="email@example.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Source</label>
              <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value as LeadSource }))}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as ClientStatus }))}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="NEGOTIATING">Negotiating</option>
                <option value="CLOSED">Closed (Won)</option>
                <option value="LOST">Closed (Lost)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Assign To Staff</label>
              <select value={form.assignedStaffId} onChange={e => setForm(p => ({ ...p, assignedStaffId: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="">Unassigned</option>
                {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Property (optional)</label>
              <select value={form.propertyId} onChange={e => setForm(p => ({ ...p, propertyId: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="">None / General</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Client Message (optional)</label>
            <textarea rows={2} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="What they're looking for..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Internal Notes (optional)</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Private notes..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-700 transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    const matchStatus = !statusFilter || l.status === statusFilter;
    const matchSource = !sourceFilter || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

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
    <div>
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          staffList={staffList}
          properties={properties}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Lead &amp; Client Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white hover:bg-primary-700 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="NEGOTIATING">Negotiating</option>
          <option value="CLOSED">Closed (Won)</option>
          <option value="LOST">Closed (Lost)</option>
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="">All Sources</option>
          {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(["NEW","CONTACTED","NEGOTIATING","CLOSED","LOST"] as ClientStatus[]).map(s => (
          <div key={s} className={`rounded-xl px-4 py-3 text-center ${STATUS_COLORS[s]}`}>
            <p className="text-2xl font-bold">{leads.filter(l => l.status === s).length}</p>
            <p className="text-xs font-bold uppercase tracking-wide mt-0.5">{s === "CLOSED" ? "Won" : s === "LOST" ? "Lost" : s}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-900 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-semibold min-w-[180px]">Client</th>
                <th className="px-6 py-4 font-semibold min-w-[180px]">Property / Message</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold min-w-[140px]">Assigned Agent</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(lead => (
                <>
                  <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-neutral-900">{lead.name}</p>
                      <a href={`tel:${lead.phone}`} className="text-xs text-primary-600 hover:underline">{lead.phone}</a>
                      {lead.email && <p className="text-xs text-neutral-400">{lead.email}</p>}
                      <p className="text-[10px] text-neutral-400 mt-1">{new Date(lead.createdAt).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" })}</p>
                    </td>
                    <td className="px-6 py-4">
                      {lead.property ? (
                        <p className="font-medium text-primary-600 truncate max-w-[220px]">{lead.property.title}</p>
                      ) : (
                        <p className="text-neutral-400 italic text-xs">General Inquiry</p>
                      )}
                      {lead.message && (
                        <p className="text-xs text-neutral-500 truncate max-w-[220px] mt-1" title={lead.message}>
                          &ldquo;{lead.message}&rdquo;
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                        {SOURCE_LABELS[lead.source]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        disabled={loadingId === lead.id}
                        value={lead.status}
                        onChange={e => handleStatusChange(lead.id, e.target.value as ClientStatus)}
                        className={`text-xs font-semibold px-2 py-1 rounded border-0 ring-1 ring-inset cursor-pointer ${STATUS_COLORS[lead.status]}`}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="NEGOTIATING">Negotiating</option>
                        <option value="CLOSED">Closed (Won)</option>
                        <option value="LOST">Closed (Lost)</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        disabled={loadingId === lead.id}
                        value={lead.assignedStaff?.id || ""}
                        onChange={e => handleReassign(lead.id, e.target.value)}
                        className="block w-full rounded-lg border-neutral-300 bg-neutral-50 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 px-2 py-1"
                      >
                        <option value="" disabled>Unassigned</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                      <a
                        href={buildWhatsAppUrl(lead.phone, lead.name, lead.property?.title ?? null)}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-xs"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WA
                      </a>
                      <button
                        onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                        className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700 font-medium text-xs"
                      >
                        Notes <ChevronDown className={`h-3 w-3 transition-transform ${expandedId === lead.id ? "rotate-180" : ""}`} />
                      </button>
                      <button
                        disabled={loadingId === lead.id}
                        onClick={() => handleDelete(lead.id, lead.name)}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-medium text-xs disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                  {expandedId === lead.id && (
                    <tr key={`${lead.id}-notes`} className="bg-neutral-50">
                      <td colSpan={6} className="px-6 py-4 border-b border-neutral-100">
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">Internal Notes</label>
                        <textarea
                          rows={3}
                          className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                          defaultValue={lead.notes ?? ""}
                          onChange={e => setEditingNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                          placeholder="Add private notes about this client..."
                        />
                        <button
                          onClick={async () => {
                            if (editingNotes[lead.id] === undefined) return;
                            setLoadingId(lead.id);
                            await adminUpdateLeadNotes(lead.id, editingNotes[lead.id]);
                            setLoadingId(null);
                          }}
                          disabled={loadingId === lead.id || editingNotes[lead.id] === undefined}
                          className="mt-2 flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                          <Save className="h-3.5 w-3.5" /> Save Notes
                        </button>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-neutral-400">
                    {leads.length === 0 ? "No leads yet. Click \"Add Lead\" to create one." : "No leads match your filters."}
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
