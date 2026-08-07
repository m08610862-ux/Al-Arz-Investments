"use client";

import { useState } from "react";
import { MessageCircle, ChevronDown, Save, Plus, X, Trash2 } from "lucide-react";
import { updateClientStatus, updateClientNotes, staffDeleteLead, staffCreateLead } from "@/app/actions/staff-clients";
import { ClientStatus, LeadSource } from "@prisma/client";

type Client = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  notes: string | null;
  source: LeadSource;
  status: ClientStatus;
  createdAt: Date;
  property: { id: string; title: string } | null;
};

type Property = { id: string; title: string };

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
  properties,
}: {
  onClose: () => void;
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
    propertyId: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError("Name and Phone are required."); return; }
    setSaving(true);
    const result = await staffCreateLead({
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      message: form.message || undefined,
      notes: form.notes || undefined,
      source: form.source,
      status: form.status,
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

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Property (optional)</label>
            <select value={form.propertyId} onChange={e => setForm(p => ({ ...p, propertyId: e.target.value }))}
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
              <option value="">None / General Inquiry</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
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

export function MyClientsTable({
  clients,
  properties,
}: {
  clients: Client[];
  properties: Property[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = clients.filter(c => {
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, status: ClientStatus) => {
    setLoadingId(id);
    await updateClientStatus(id, status);
    setLoadingId(null);
  };

  const handleSaveNotes = async (id: string) => {
    if (editingNotes[id] === undefined) return;
    setLoadingId(id);
    await updateClientNotes(id, editingNotes[id]);
    setLoadingId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete lead "${name}"? This cannot be undone.`)) return;
    setLoadingId(id);
    await staffDeleteLead(id);
    setLoadingId(null);
  };

  return (
    <div>
      {showAddModal && (
        <AddLeadModal onClose={() => setShowAddModal(false)} properties={properties} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">My Clients</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white hover:bg-primary-700 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(["NEW","CONTACTED","NEGOTIATING","CLOSED","LOST"] as ClientStatus[]).map(s => (
          <div key={s} className={`rounded-xl px-4 py-3 text-center ${STATUS_COLORS[s]}`}>
            <p className="text-2xl font-bold">{clients.filter(c => c.status === s).length}</p>
            <p className="text-xs font-bold uppercase tracking-wide mt-0.5">{s === "CLOSED" ? "Won" : s === "LOST" ? "Lost" : s}</p>
          </div>
        ))}
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
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="NEGOTIATING">Negotiating</option>
          <option value="CLOSED">Closed (Won)</option>
          <option value="LOST">Closed (Lost)</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-500">
            {clients.length === 0
              ? "No leads yet. Click \"Add Lead\" to create your first one."
              : "No clients match your filters."}
          </div>
        )}

        {filtered.map(client => (
          <div key={client.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            {/* Main Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-neutral-900">{client.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[client.status]}`}>
                    {client.status}
                  </span>
                  <span className="text-xs font-semibold bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded">
                    {SOURCE_LABELS[client.source]}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mt-0.5">
                  <a href={`tel:${client.phone}`} className="hover:text-primary-600 transition-colors">{client.phone}</a>
                  {client.email ? ` · ${client.email}` : ""}
                </p>
                {client.property && (
                  <p className="text-xs text-primary-600 mt-1 font-medium truncate">Re: {client.property.title}</p>
                )}
                {client.message && (
                  <p className="text-xs text-neutral-500 mt-1 truncate max-w-sm" title={client.message}>
                    &ldquo;{client.message}&rdquo;
                  </p>
                )}
                <p className="text-[10px] text-neutral-400 mt-1">
                  {new Date(client.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {/* WhatsApp */}
                <a
                  href={buildWhatsAppUrl(client.phone, client.name, client.property?.title ?? null)}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>

                {/* Status dropdown */}
                <div className="relative">
                  <select
                    disabled={loadingId === client.id}
                    value={client.status}
                    onChange={e => handleStatusChange(client.id, e.target.value as ClientStatus)}
                    className={`text-xs font-semibold pl-2 pr-6 py-1.5 rounded-lg border-0 ring-1 ring-inset cursor-pointer appearance-none ${STATUS_COLORS[client.status]}`}
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="NEGOTIATING">Negotiating</option>
                    <option value="CLOSED">Closed (Won)</option>
                    <option value="LOST">Closed (Lost)</option>
                  </select>
                  <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
                </div>

                {/* Notes toggle */}
                <button
                  onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                  className="text-xs text-neutral-500 hover:text-neutral-700 font-medium px-2 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Notes
                </button>

                {/* Delete */}
                <button
                  disabled={loadingId === client.id}
                  onClick={() => handleDelete(client.id, client.name)}
                  className="text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Expandable Notes */}
            {expandedId === client.id && (
              <div className="border-t border-neutral-100 p-5 bg-neutral-50">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Internal Notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  defaultValue={client.notes ?? ""}
                  onChange={e => setEditingNotes(prev => ({ ...prev, [client.id]: e.target.value }))}
                  placeholder="Add private notes about this client..."
                />
                <button
                  onClick={() => handleSaveNotes(client.id)}
                  disabled={loadingId === client.id || editingNotes[client.id] === undefined}
                  className="mt-2 flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  {loadingId === client.id ? "Saving..." : "Save Notes"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
