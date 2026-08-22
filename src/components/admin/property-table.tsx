"use client";

import { useState, useMemo } from "react";
import { Trash2, Eye, EyeOff, Flame, Rocket, Search, X } from "lucide-react";
import { deleteProperty, reassignProperty, adminTogglePropertyActiveStatus } from "@/app/actions/admin-properties";
import Link from "next/link";
import Image from "next/image";

type Staff = { id: string; name: string };

type PropertyList = {
  id: string;
  title: string;
  price: number;
  city: string;
  society: string | null;
  phase: string | null;
  category: string;
  type: string;
  status: string;
  isActive: boolean;
  label: string;
  images: string[];
  assignedTo: Staff | null;
  createdBy: Staff;
};

const SELECT_CLS = "h-9 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer";

export function PropertyTable({ 
  properties, 
  staffList 
}: { 
  properties: PropertyList[];
  staffList: Staff[];
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // ── Filters ──────────────────────────────────────────────────────────────
  const [search, setSearch]     = useState("");
  const [fType, setFType]       = useState("ALL");
  const [fCity, setFCity]       = useState("");
  const [fSociety, setFSociety] = useState("");
  const [fPhase, setFPhase]     = useState("");
  const [fCategory, setFCategory] = useState("");
  const [fMinPrice, setFMinPrice] = useState("");
  const [fMaxPrice, setFMaxPrice] = useState("");
  const [fLabel, setFLabel]     = useState("ALL");
  const [fVisible, setFVisible] = useState("ALL");

  // ── Derived unique option lists ───────────────────────────────────────────
  const cities    = useMemo(() => [...new Set(properties.map(p => p.city).filter(Boolean))].sort(), [properties]);
  const societies = useMemo(() => [...new Set(properties.map(p => p.society).filter(Boolean) as string[])].sort(), [properties]);
  const phases    = useMemo(() => [...new Set(properties.map(p => p.phase).filter(Boolean) as string[])].sort(), [properties]);
  const categories = useMemo(() => [...new Set(properties.map(p => p.category).filter(Boolean))].sort(), [properties]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return properties.filter(p => {
      if (q && !p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false;
      if (fType !== "ALL" && p.type !== fType) return false;
      if (fCity && p.city !== fCity) return false;
      if (fSociety && p.society !== fSociety) return false;
      if (fPhase && p.phase !== fPhase) return false;
      if (fCategory && p.category !== fCategory) return false;
      if (fMinPrice && p.price < parseFloat(fMinPrice)) return false;
      if (fMaxPrice && p.price > parseFloat(fMaxPrice)) return false;
      if (fLabel !== "ALL" && p.label !== fLabel) return false;
      if (fVisible === "VISIBLE" && !p.isActive) return false;
      if (fVisible === "HIDDEN" && p.isActive) return false;
      return true;
    });
  }, [properties, search, fType, fCity, fSociety, fPhase, fCategory, fMinPrice, fMaxPrice, fLabel, fVisible]);

  const hasFilters = search || fType !== "ALL" || fCity || fSociety || fPhase || fCategory || fMinPrice || fMaxPrice || fLabel !== "ALL" || fVisible !== "ALL";
  const clearFilters = () => { setSearch(""); setFType("ALL"); setFCity(""); setFSociety(""); setFPhase(""); setFCategory(""); setFMinPrice(""); setFMaxPrice(""); setFLabel("ALL"); setFVisible("ALL"); };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleToggleActive = async (id: string, currentlyActive: boolean) => {
    setLoadingId(id);
    await adminTogglePropertyActiveStatus(id, !currentlyActive);
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Property Management</h1>
        <span className="text-sm text-neutral-500">{filtered.length} of {properties.length} listings</span>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 mb-6 space-y-3">
        {/* Row 1: search + type tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title or city…"
              className="w-full h-9 rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-xs font-medium text-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          {/* Type tabs */}
          <div className="flex rounded-lg border border-neutral-200 overflow-hidden text-xs font-bold">
            {["ALL", "SALE", "RENT", "INVESTMENT"].map(t => (
              <button key={t} onClick={() => setFType(t)}
                className={`px-3 h-9 transition-colors ${fType === t ? "bg-primary-600 text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"}`}>
                {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Visibility */}
          <select value={fVisible} onChange={e => setFVisible(e.target.value)} className={SELECT_CLS}>
            <option value="ALL">All Visibility</option>
            <option value="VISIBLE">Visible</option>
            <option value="HIDDEN">Hidden</option>
          </select>

          {/* Label */}
          <select value={fLabel} onChange={e => setFLabel(e.target.value)} className={SELECT_CLS}>
            <option value="ALL">All Labels</option>
            <option value="HOT">Hot</option>
            <option value="SUPER_HOT">Super Hot</option>
            <option value="NONE">None</option>
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 h-9 px-3 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors">
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Row 2: City / Society / Phase / Category / Price */}
        <div className="flex flex-wrap items-center gap-3">
          <select value={fCity} onChange={e => setFCity(e.target.value)} className={SELECT_CLS}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={fSociety} onChange={e => setFSociety(e.target.value)} className={SELECT_CLS}>
            <option value="">All Societies</option>
            {societies.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={fPhase} onChange={e => setFPhase(e.target.value)} className={SELECT_CLS}>
            <option value="">All Phases</option>
            {phases.map(ph => <option key={ph} value={ph}>{ph}</option>)}
          </select>

          <select value={fCategory} onChange={e => setFCategory(e.target.value)} className={SELECT_CLS}>
            <option value="">All Types</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input type="number" value={fMinPrice} onChange={e => setFMinPrice(e.target.value)}
            placeholder="Min Price"
            className="w-28 h-9 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input type="number" value={fMaxPrice} onChange={e => setFMaxPrice(e.target.value)}
            placeholder="Max Price"
            className="w-28 h-9 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>

      {/* ── Table ── */}
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
              {filtered.map((property) => (
                <tr key={property.id} className={`hover:bg-neutral-50 transition-colors ${!property.isActive ? "opacity-50" : ""}`}>
                  <td className="px-4 py-4 text-center">
                    <button
                      disabled={loadingId === property.id}
                      onClick={() => handleToggleActive(property.id, property.isActive)}
                      title={property.isActive ? "Click to hide from public" : "Click to show on public site"}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                        property.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      {property.isActive ? <><Eye className="h-3.5 w-3.5" /> Live</> : <><EyeOff className="h-3.5 w-3.5" /> Hidden</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Cover image thumbnail */}
                      <div className="relative h-14 w-20 shrink-0 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                        {property.images?.[0] ? (
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-neutral-300 text-[10px] font-medium select-none">
                            No Photo
                          </div>
                        )}
                      </div>
                      {/* Title + meta */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-neutral-900 truncate max-w-[250px]">{property.title}</p>
                          {property.label === "SUPER_HOT" && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 rounded shrink-0"><Rocket className="h-3 w-3" /> Super Hot</span>}
                          {property.label === "HOT" && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600 rounded shrink-0"><Flame className="h-3 w-3" /> Hot</span>}
                        </div>
                        <p className="text-xs text-neutral-500 truncate">{[property.city, property.society, property.phase].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">Rs {property.price.toLocaleString("en-PK")}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-semibold bg-neutral-100 px-2 py-0.5 rounded">{property.type}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${property.status === "AVAILABLE" ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-700"}`}>
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
                      {staffList.map(staff => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
                    </select>
                    {!property.assignedTo && <p className="text-[10px] text-neutral-400 mt-1">Default: {property.createdBy.name}</p>}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    <Link href={`/properties/${property.id}`} className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium" target="_blank">View</Link>
                    <button disabled={loadingId === property.id} onClick={() => handleDelete(property.id)} className="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-700 disabled:opacity-50">
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    {hasFilters ? "No properties match the current filters." : "No properties found."}
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
