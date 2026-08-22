"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Search,
  Download,
  CheckCircle2,
  RefreshCw,
  Copy,
  X,
  AlertCircle,
  Pencil,
} from "lucide-react";
import {
  createStaffInventoryItem,
  updateStaffInventoryCell,
  deleteStaffInventoryItem,
  StaffInventoryInput,
} from "@/app/actions/staff-inventory";
import { InventoryModal } from "./inventory-modal";

export type InventoryRow = {
  id: string;
  title: string | null;
  price: number | null;
  city: string | null;
  society: string | null;
  phase: string | null;
  type: string | null;
  purpose: string | null;
  category: string | null;
  propertyType: string | null;
  status: string;
  label: string | null;
  address: string | null;
  street: string | null;
  plotNo?: string | null;
  number: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  areaUnit: string | null;
  size: string | null;
  sizeUnit: string | null;
  description: string | null;
  detail: string | null;
  images: string[];
  contact: string | null;
  comment: string | null;
  createdBy?: {
    name: string | null;
    email: string | null;
  } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

interface InventoryTableProps {
  initialData: InventoryRow[];
  canAdd?: boolean;
  subtitle?: string;
}

// ── Exact Dropdown Options matching Add Property Modal ───────────────────────
const SOCIETIES = ["DHA", "Bahria Town"];

const PHASES = [
  "Phase 1",
  "Phase 2",
  "Phase 3",
  "Phase 4",
  "Phase 5",
  "Phase 6",
  "Phase 7",
  "Phase 8",
];

const PURPOSE_OPTIONS = [
  { value: "SALE", label: "For Sale" },
  { value: "RENT", label: "For Rent" },
  { value: "INVESTMENT", label: "Investment" },
];

const PROPERTY_CATEGORIES = [
  { value: "HOUSE", label: "House" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "SHOP", label: "Shop" },
  { value: "FARMHOUSE", label: "Farmhouse" },
  { value: "VILLA", label: "Villa" },
  { value: "BUILDING", label: "Building" },
];

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available", bg: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { value: "SOLD", label: "Sold", bg: "bg-rose-100 text-rose-800 border-rose-300" },
  { value: "RENTED", label: "Rented", bg: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "RESERVED", label: "Reserved", bg: "bg-amber-100 text-amber-800 border-amber-300" },
];

const AREA_UNITS = [
  { value: "MARLA", label: "Marla", short: "M" },
  { value: "KANAL", label: "Kanal", short: "K" },
  { value: "SQFT", label: "Sqft", short: "Sq" },
];

function formatDate(dateVal: Date | string | undefined | null) {
  if (!dateVal) return "—";
  try {
    const d = new Date(dateVal);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }); // compact e.g. "22 Aug"
  } catch {
    return String(dateVal).slice(5, 10);
  }
}

export function InventoryTable({
  initialData,
  canAdd = true,
  subtitle,
}: InventoryTableProps) {
  const [rows, setRows] = useState<InventoryRow[]>(initialData);
  const [isPending, startTransition] = useTransition();
  const [savingStatus, setSavingStatus] = useState<"saved" | "saving" | "error">("saved");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryRow | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSociety, setFilterSociety] = useState("ALL");
  const [filterPhase, setFilterPhase] = useState("ALL");
  const [filterPropertyType, setFilterPropertyType] = useState("ALL");
  const [filterPurpose, setFilterPurpose] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Keep local state in sync if initialData changes
  useEffect(() => {
    setRows(initialData);
  }, [initialData]);

  // Derive unique societies and phases from the current rows + default property options
  const availableSocieties = useMemo(() => {
    const set = new Set<string>(SOCIETIES);
    rows.forEach((r) => {
      if (r.society?.trim()) set.add(r.society.trim());
    });
    return Array.from(set).sort();
  }, [rows]);

  const availablePhases = useMemo(() => {
    const set = new Set<string>(PHASES);
    rows.forEach((r) => {
      if (r.phase?.trim()) set.add(r.phase.trim());
    });
    return Array.from(set).sort();
  }, [rows]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const dateStr = formatDate(row.createdAt).toLowerCase();
        const creatorStr = (row.createdBy?.name || "").toLowerCase();

        const matchesSearch =
          dateStr.includes(q) ||
          creatorStr.includes(q) ||
          (row.society && row.society.toLowerCase().includes(q)) ||
          (row.phase && row.phase.toLowerCase().includes(q)) ||
          (row.propertyType && row.propertyType.toLowerCase().includes(q)) ||
          (row.category && row.category.toLowerCase().includes(q)) ||
          (row.purpose && row.purpose.toLowerCase().includes(q)) ||
          (row.type && row.type.toLowerCase().includes(q)) ||
          (row.size && row.size.toLowerCase().includes(q)) ||
          (row.sizeUnit && row.sizeUnit.toLowerCase().includes(q)) ||
          (row.street && row.street.toLowerCase().includes(q)) ||
          (row.address && row.address.toLowerCase().includes(q)) ||
          (row.number && row.number.toLowerCase().includes(q)) ||
          (row.detail && row.detail.toLowerCase().includes(q)) ||
          (row.price !== null && row.price !== undefined && String(row.price).includes(q)) ||
          (row.contact && row.contact.toLowerCase().includes(q)) ||
          (row.comment && row.comment.toLowerCase().includes(q)) ||
          (row.status && row.status.toLowerCase().includes(q));

        if (!matchesSearch) return false;
      }

      // Society
      if (filterSociety !== "ALL" && (row.society?.trim() || "") !== filterSociety) {
        return false;
      }

      // Phase
      if (filterPhase !== "ALL" && (row.phase?.trim() || "") !== filterPhase) {
        return false;
      }

      // Property Type / Category
      if (filterPropertyType !== "ALL") {
        const cat = (row.category || row.propertyType || "").toUpperCase();
        if (cat !== filterPropertyType.toUpperCase()) return false;
      }

      // Purpose / Type
      if (filterPurpose !== "ALL") {
        const typ = (row.type || row.purpose || "SALE").toUpperCase();
        if (typ !== filterPurpose.toUpperCase()) return false;
      }

      // Status
      if (filterStatus !== "ALL") {
        const stat = (row.status || "AVAILABLE").toUpperCase();
        if (stat !== filterStatus.toUpperCase()) return false;
      }

      return true;
    });
  }, [rows, searchQuery, filterSociety, filterPhase, filterPropertyType, filterPurpose, filterStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = rows.length;
    const available = rows.filter((r) => (r.status || "AVAILABLE").toUpperCase() === "AVAILABLE").length;
    const sold = rows.filter((r) => (r.status || "").toUpperCase() === "SOLD").length;
    const reserved = rows.filter((r) => (r.status || "").toUpperCase() === "RESERVED").length;
    return { total, available, sold, reserved };
  }, [rows]);

  // Handle cell change and save inline
  const handleCellBlur = async (id: string, field: keyof StaffInventoryInput, value: string) => {
    const currentRow = rows.find((r) => r.id === id);
    if (!currentRow) return;

    // Check if value actually changed
    const prevVal = (currentRow[field as keyof InventoryRow] as string) || "";
    if (prevVal === value) return;

    // Optimistic local update
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value, updatedAt: new Date().toISOString() } : r))
    );

    setSavingStatus("saving");
    try {
      const res = await updateStaffInventoryCell(id, field, value);
      if (res.success) {
        setSavingStatus("saved");
      } else {
        setSavingStatus("error");
        setErrorMsg(res.error || "Failed to save cell.");
      }
    } catch (e: any) {
      setSavingStatus("error");
      setErrorMsg("Network error saving changes.");
    }
  };

  // Open modal for new row
  const handleOpenAddModal = () => {
    setSelectedInventory(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing row
  const handleOpenEditModal = (row: InventoryRow) => {
    setSelectedInventory(row);
    setIsModalOpen(true);
  };

  // Callback when modal creates/updates item
  const handleModalSuccess = (item: InventoryRow, isEdit: boolean) => {
    if (isEdit) {
      setRows((prev) => prev.map((r) => (r.id === item.id ? item : r)));
    } else {
      setRows((prev) => [item, ...prev]);
    }
    setSavingStatus("saved");
  };

  // Duplicate a row
  const handleDuplicateRow = (row: InventoryRow) => {
    startTransition(async () => {
      setSavingStatus("saving");
      const res = await createStaffInventoryItem({
        title: row.title ? `${row.title} (Copy)` : "",
        price: row.price,
        city: row.city || "Rawalpindi",
        society: row.society || "",
        phase: row.phase || "",
        type: row.type || row.purpose || "SALE",
        purpose: row.purpose || row.type || "SALE",
        category: row.category || row.propertyType || "HOUSE",
        propertyType: row.propertyType || row.category || "HOUSE",
        size: row.size || (row.area ? String(row.area) : ""),
        sizeUnit: row.sizeUnit || row.areaUnit || "MARLA",
        area: row.area,
        areaUnit: row.areaUnit || row.sizeUnit || "MARLA",
        street: row.street || row.address || "",
        address: row.address || row.street || "",
        number: row.number ? `${row.number} (Copy)` : "",
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        description: row.description || row.detail || "",
        detail: row.detail || row.description || "",
        contact: row.contact || "",
        status: row.status || "AVAILABLE",
        comment: row.comment || "",
        images: row.images || [],
      });

      if (res.success && res.item) {
        setRows((prev) => [res.item as InventoryRow, ...prev]);
        setSavingStatus("saved");
      } else {
        setSavingStatus("error");
        setErrorMsg(res.error || "Failed to duplicate row.");
      }
    });
  };

  // Delete a row
  const handleDeleteRow = (id: string) => {
    if (!confirm("Are you sure you want to delete this row?")) return;

    // Optimistic removal
    setRows((prev) => prev.filter((r) => r.id !== id));

    startTransition(async () => {
      setSavingStatus("saving");
      const res = await deleteStaffInventoryItem(id);
      if (res.success) {
        setSavingStatus("saved");
      } else {
        setSavingStatus("error");
        setErrorMsg(res.error || "Failed to delete item.");
      }
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Posted By",
      "Society",
      "Phase",
      "Property Type",
      "Purpose",
      "Size",
      "Size Unit",
      "Street",
      "No",
      "Detail",
      "Price",
      "Contact",
      "Status",
      "Comment",
    ];

    const csvRows = filteredRows.map((r) => [
      `"${formatDate(r.createdAt)}"`,
      `"${(r.createdBy?.name || "Agent").replace(/"/g, '""')}"`,
      `"${(r.society || "").replace(/"/g, '""')}"`,
      `"${(r.phase || "").replace(/"/g, '""')}"`,
      `"${(r.category || r.propertyType || "HOUSE").replace(/"/g, '""')}"`,
      `"${(r.type || r.purpose || "SALE").replace(/"/g, '""')}"`,
      `"${(r.size || (r.area ? String(r.area) : "")).replace(/"/g, '""')}"`,
      `"${(r.areaUnit || r.sizeUnit || "MARLA").replace(/"/g, '""')}"`,
      `"${(r.street || r.address || "").replace(/"/g, '""')}"`,
      `"${(r.number || "").replace(/"/g, '""')}"`,
      `"${(r.detail || r.description || "").replace(/"/g, '""')}"`,
      `"${(r.price !== null && r.price !== undefined ? String(r.price) : "").replace(/"/g, '""')}"`,
      `"${(r.contact || "").replace(/"/g, '""')}"`,
      `"${(r.status || "AVAILABLE").replace(/"/g, '""')}"`,
      `"${(r.comment || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Al_Arz_Staff_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters =
    searchQuery ||
    filterSociety !== "ALL" ||
    filterPhase !== "ALL" ||
    filterPropertyType !== "ALL" ||
    filterPurpose !== "ALL" ||
    filterStatus !== "ALL";

  const clearFilters = () => {
    setSearchQuery("");
    setFilterSociety("ALL");
    setFilterPhase("ALL");
    setFilterPropertyType("ALL");
    setFilterPurpose("ALL");
    setFilterStatus("ALL");
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* ── Add / Edit Inventory Modal (Identical to Add Property Modal) ───────── */}
      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inventory={selectedInventory}
        onSuccess={handleModalSuccess}
      />

      {/* ── Google Sheets Top Header Bar ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shrink-0">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-primary-900 tracking-tight">
                Inventory Master Sheet
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                {savingStatus === "saving" && (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Saving...
                  </span>
                )}
                {savingStatus === "saved" && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> All changes saved
                  </span>
                )}
                {savingStatus === "error" && (
                  <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                    <AlertCircle className="h-3 w-3" /> Error saving: {errorMsg}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors shadow-sm"
              title="Download CSV"
            >
              <Download className="h-4 w-4 text-neutral-600" />
              <span>Export CSV</span>
            </button>
            {canAdd && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="btn-cta inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Inventory</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100 flex-wrap">
          <div className="text-xs font-bold px-3 py-1 bg-neutral-100 text-neutral-800 rounded-lg border border-neutral-200">
            Total: <span className="text-primary-900 font-extrabold">{stats.total}</span>
          </div>
          <div className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
            Available: <span className="font-extrabold">{stats.available}</span>
          </div>
          <div className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
            Sold: <span className="font-extrabold">{stats.sold}</span>
          </div>
          <div className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
            Reserved: <span className="font-extrabold">{stats.reserved}</span>
          </div>
        </div>
      </div>

      {/* ── Filters Toolbar (Dropdown values matching Property Modal) ─────────── */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search date, agent, society, phase, contact, street, no..."
            className="w-full pl-9 pr-8 py-2 text-xs font-medium text-primary-900 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-neutral-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns with exact property modal values */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Society filter */}
          <select
            value={filterSociety}
            onChange={(e) => setFilterSociety(e.target.value)}
            className="h-9 px-2.5 text-xs font-semibold text-neutral-700 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">Society: All</option>
            {availableSocieties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Phase filter */}
          <select
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value)}
            className="h-9 px-2.5 text-xs font-semibold text-neutral-700 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">Phase: All</option>
            {availablePhases.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Property Category / Type filter */}
          <select
            value={filterPropertyType}
            onChange={(e) => setFilterPropertyType(e.target.value)}
            className="h-9 px-2.5 text-xs font-semibold text-neutral-700 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">Type: All</option>
            {PROPERTY_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Purpose / Type filter */}
          <select
            value={filterPurpose}
            onChange={(e) => setFilterPurpose(e.target.value)}
            className="h-9 px-2.5 text-xs font-semibold text-neutral-700 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">Purpose: All</option>
            {PURPOSE_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-2.5 text-xs font-semibold text-neutral-700 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="h-9 px-3 inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Google Sheets Table Grid Container (NO HORIZONTAL SCROLL) ─────────── */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col w-full">
        {/* Table Container - Fits 100% without horizontal scrollbar */}
        <div className="w-full overflow-x-hidden overflow-y-auto max-h-[calc(100vh-300px)] min-h-[380px]">
          <table className="w-full table-fixed border-collapse text-left select-text">
            {/* Proportional Column Headers spanning exactly 100% */}
            <thead className="sticky top-0 z-20 bg-neutral-100 shadow-[0_1px_0_0_#cbd5e1]">
              <tr className="border-b border-neutral-300 text-[10px] font-bold text-neutral-600 uppercase tracking-tight">
                {/* Row Number Header: 3% */}
                <th className="w-[3%] px-1 py-2 bg-neutral-200 border-r border-b border-neutral-300 text-center font-mono text-[9px] text-neutral-500 select-none">
                  #
                </th>
                {/* Date: 6% */}
                <th className="w-[6%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Date Added">Date</th>
                {/* Posted By (Agent): 7% */}
                <th className="w-[7%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Posted By (Agent)">Agent</th>
                {/* Society: 7% */}
                <th className="w-[7%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Society">Society</th>
                {/* Phase: 6% */}
                <th className="w-[6%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Phase">Phase</th>
                {/* Property Type: 7% */}
                <th className="w-[7%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Property Type">Type</th>
                {/* Purpose: 5% */}
                <th className="w-[5%] px-1 py-2 border-r border-neutral-300 truncate" title="Purpose">Purpose</th>
                {/* Size: 7% */}
                <th className="w-[7%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Size">Size</th>
                {/* House and Street No (combined): 9% */}
                <th className="w-[9%] px-1.5 py-2 border-r border-neutral-300 truncate" title="House and Street No (e.g. House 5, St 3)">House &amp; Street No</th>
                {/* Detail: 11% */}
                <th className="w-[11%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Detail / Specifications">Detail</th>
                {/* Price: 8% */}
                <th className="w-[8%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Price">Price</th>
                {/* Contact: 7% */}
                <th className="w-[7%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Contact">Contact</th>
                {/* Status: 7% */}
                <th className="w-[7%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Status">Status</th>
                {/* Comment: 7% */}
                <th className="w-[7%] px-1.5 py-2 border-r border-neutral-300 truncate" title="Comment">Comment</th>
                {/* Actions: 6% */}
                <th className="w-[6%] px-1 py-2 text-center truncate">Actions</th>
              </tr>
            </thead>

            {/* Sheet Rows */}
            <tbody className="divide-y divide-neutral-200 font-sans text-[11px] bg-white">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={15} className="py-16 text-center text-neutral-400 bg-neutral-50/50">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSpreadsheet className="h-10 w-10 text-neutral-300" />
                      <p className="font-semibold text-sm text-neutral-600">
                        {rows.length === 0 ? "Your Inventory Sheet is empty" : "No rows match your filters"}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {rows.length === 0
                          ? "Click the button below to add your first inventory entry."
                          : "Try clearing your search or filters to see all entries."}
                      </p>
                      {rows.length === 0 ? (
                        canAdd ? (
                          <button
                            type="button"
                            onClick={handleOpenAddModal}
                            className="mt-3 btn-cta inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add First Entry</span>
                          </button>
                        ) : null
                      ) : (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-200 hover:bg-neutral-300 transition-colors shadow-sm cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, index) => {
                  const currentStatus = STATUS_OPTIONS.find(
                    (s) => s.value.toUpperCase() === (row.status || "AVAILABLE").toUpperCase() || s.label.toUpperCase() === (row.status || "AVAILABLE").toUpperCase()
                  ) || STATUS_OPTIONS[0];

                  const agentName = row.createdBy?.name || "Staff";

                  return (
                    <tr
                      key={row.id}
                      className="group hover:bg-emerald-50/20 transition-colors border-b border-neutral-200"
                    >
                      {/* Row Index: 3% */}
                      <td className="w-[3%] px-1 py-1.5 bg-neutral-50 group-hover:bg-emerald-50/50 border-r border-neutral-200 text-center font-mono text-[10px] text-neutral-400 select-none truncate">
                        {index + 1}
                      </td>

                      {/* Date: 6% */}
                      <td
                        className="w-[6%] px-1.5 py-1.5 border-r border-neutral-200 text-[10px] font-mono text-neutral-600 truncate select-none bg-neutral-50/20"
                        title={row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ""}
                      >
                        {formatDate(row.createdAt)}
                      </td>

                      {/* Posted By (Agent): 7% */}
                      <td
                        className="w-[7%] px-1.5 py-1.5 border-r border-neutral-200 text-[11px] font-medium text-neutral-800 truncate select-none bg-neutral-50/20"
                        title={agentName}
                      >
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="h-4 w-4 rounded-full bg-accent-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                            {agentName.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate font-semibold text-neutral-700">
                            {agentName}
                          </span>
                        </div>
                      </td>

                      {/* 1. Society: 7% (Dropdown matching Property Modal) */}
                      <td className="w-[7%] p-0.5 border-r border-neutral-200 overflow-hidden">
                        <select
                          value={row.society || ""}
                          onChange={(e) => handleCellBlur(row.id, "society", e.target.value)}
                          className="w-full text-[10px] font-semibold py-0.5 px-1 bg-transparent rounded border-0 hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer truncate"
                        >
                          <option value="">— None —</option>
                          {SOCIETIES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 2. Phase: 6% (Dropdown matching Property Modal) */}
                      <td className="w-[6%] p-0.5 border-r border-neutral-200 overflow-hidden">
                        <select
                          value={row.phase || ""}
                          onChange={(e) => handleCellBlur(row.id, "phase", e.target.value)}
                          className="w-full text-[10px] font-semibold py-0.5 px-1 bg-transparent rounded border-0 hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer truncate"
                        >
                          <option value="">— None —</option>
                          {PHASES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 3. Property Type / Category: 7% (Dropdown matching Property Modal) */}
                      <td className="w-[7%] p-0.5 border-r border-neutral-200 overflow-hidden">
                        <select
                          value={(row.category || row.propertyType || "HOUSE").toUpperCase()}
                          onChange={(e) => {
                            handleCellBlur(row.id, "category", e.target.value);
                            handleCellBlur(row.id, "propertyType", e.target.value);
                          }}
                          className="w-full text-[10px] font-semibold py-0.5 px-1 bg-transparent rounded border-0 hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer truncate"
                        >
                          {PROPERTY_CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 4. Purpose / Type: 5% (Dropdown matching Property Modal) */}
                      <td className="w-[5%] p-0.5 border-r border-neutral-200 overflow-hidden">
                        <select
                          value={(row.type || row.purpose || "SALE").toUpperCase()}
                          onChange={(e) => {
                            handleCellBlur(row.id, "type", e.target.value);
                            handleCellBlur(row.id, "purpose", e.target.value);
                          }}
                          className="w-full text-[10px] font-semibold py-0.5 px-1 bg-neutral-50 rounded border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer truncate"
                        >
                          {PURPOSE_OPTIONS.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 5. Size + Size Unit: 7% (Dropdown matching Property Modal) */}
                      <td className="w-[7%] p-0 border-r border-neutral-200 relative overflow-hidden">
                        <div className="flex items-center h-full w-full">
                          <EditableCell
                            initialValue={row.size ? String(row.size) : row.area ? String(row.area) : ""}
                            placeholder="5"
                            className="w-10 min-w-0"
                            onSave={(val) => {
                              handleCellBlur(row.id, "size", val);
                              handleCellBlur(row.id, "area", val);
                            }}
                          />
                          <select
                            value={(row.areaUnit || row.sizeUnit || "MARLA").toUpperCase()}
                            onChange={(e) => {
                              handleCellBlur(row.id, "areaUnit", e.target.value);
                              handleCellBlur(row.id, "sizeUnit", e.target.value);
                            }}
                            className="text-[9px] font-bold text-neutral-600 bg-neutral-100 px-0.5 py-0.5 rounded border-l border-neutral-200 focus:outline-none cursor-pointer shrink-0"
                          >
                            {AREA_UNITS.map((u) => (
                              <option key={u.value} value={u.value} title={u.label}>
                                {u.short}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* 6. House and Street No (combined, 9%) */}
                      <td className="w-[9%] p-0 border-r border-neutral-200 relative overflow-hidden">
                        <EditableCell
                          initialValue={[row.street || row.address, row.number || row.plotNo].filter(Boolean).join(", ")}
                          placeholder="e.g. House 5, St 3"
                          onSave={(val) => {
                            // Parse "St 5, No 3" style into street and number parts
                            const parts = val.split(",").map((p) => p.trim());
                            const streetPart = parts[0] || "";
                            const numberPart = parts.slice(1).join(", ") || "";
                            handleCellBlur(row.id, "street", streetPart);
                            if (numberPart) handleCellBlur(row.id, "number", numberPart);
                          }}
                        />
                      </td>

                      {/* 8. Detail: 11% */}
                      <td className="w-[11%] p-0 border-r border-neutral-200 relative overflow-hidden">
                        <EditableCell
                          initialValue={row.detail || row.description || ""}
                          placeholder="Corner..."
                          onSave={(val) => handleCellBlur(row.id, "detail", val)}
                        />
                      </td>

                      {/* 9. Price: 8% */}
                      <td className="w-[8%] p-0 border-r border-neutral-200 relative overflow-hidden">
                        <EditableCell
                          initialValue={row.price !== null && row.price !== undefined ? String(row.price) : ""}
                          placeholder="Price"
                          className="font-semibold text-emerald-800"
                          onSave={(val) => handleCellBlur(row.id, "price", val)}
                        />
                      </td>

                      {/* 10. Contact: 7% */}
                      <td className="w-[7%] p-0 border-r border-neutral-200 relative overflow-hidden">
                        <EditableCell
                          initialValue={row.contact || ""}
                          placeholder="0300-..."
                          onSave={(val) => handleCellBlur(row.id, "contact", val)}
                        />
                      </td>

                      {/* 11. Status Dropdown: 7% (Dropdown matching Property Modal) */}
                      <td className="w-[7%] p-0.5 border-r border-neutral-200 overflow-hidden">
                        <select
                          value={(row.status || "AVAILABLE").toUpperCase()}
                          onChange={(e) => handleCellBlur(row.id, "status", e.target.value)}
                          className={`w-full text-[10px] font-bold py-0.5 px-1 rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer truncate ${currentStatus.bg}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value} className="bg-white text-neutral-900 font-medium">
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 12. Comment: 7% */}
                      <td className="w-[7%] p-0 border-r border-neutral-200 relative overflow-hidden">
                        <EditableCell
                          initialValue={row.comment || ""}
                          placeholder="Notes"
                          onSave={(val) => handleCellBlur(row.id, "comment", val)}
                        />
                      </td>

                      {/* Actions: 6% */}
                      <td className="w-[6%] px-1 py-1 text-center overflow-hidden">
                        <div className="flex items-center justify-center gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(row)}
                            title="Edit Full Details"
                            className="p-1 text-neutral-400 hover:text-primary-700 hover:bg-neutral-100 rounded transition-colors"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateRow(row)}
                            title="Duplicate Row"
                            className="p-1 text-neutral-400 hover:text-primary-700 hover:bg-neutral-100 rounded transition-colors"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(row.id)}
                            title="Delete Row"
                            className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Bar */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          {canAdd ? (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 hover:bg-emerald-100/70 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add New Entry</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-primary-500">
              Admin View Mode (All Staff Inventory)
            </span>
          )}
          <span className="text-[11px] text-neutral-400 font-medium">
            Showing {filteredRows.length} of {rows.length} rows
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Inline Editable Cell Component ───────────────────────────────────────────
interface EditableCellProps {
  initialValue: string;
  placeholder?: string;
  className?: string;
  suggestions?: string[];
  onSave: (value: string) => void;
}

function EditableCell({
  initialValue,
  placeholder,
  className = "",
  suggestions,
  onSave,
}: EditableCellProps) {
  const [val, setVal] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    setIsFocused(false);
    if (val !== initialValue) {
      onSave(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[30px] flex items-center overflow-hidden">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        title={val || placeholder}
        list={suggestions ? `list-${placeholder?.replace(/\s+/g, "")}` : undefined}
        className={`w-full h-full px-1.5 py-1 text-[11px] font-medium text-neutral-900 bg-transparent placeholder:text-neutral-300 border-0 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white focus:z-10 transition-all truncate min-w-0 ${className} ${
          isFocused ? "shadow-inner bg-white" : ""
        }`}
      />
      {suggestions && (
        <datalist id={`list-${placeholder?.replace(/\s+/g, "")}`}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}
