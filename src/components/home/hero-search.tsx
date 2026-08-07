"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, SlidersHorizontal, X, Home, Building2, Castle, Crop, Briefcase, Leaf, LandPlot } from "lucide-react";

const CATEGORY_CHIPS = [
  { value: "HOUSE",      label: "House",      icon: Home },
  { value: "APARTMENT", label: "Apartment",  icon: Building2 },
  { value: "VILLA",     label: "Villa",      icon: Castle },
  { value: "PLOT",      label: "Plot",       icon: LandPlot },
  { value: "COMMERCIAL",label: "Commercial", icon: Briefcase },
  { value: "FARMHOUSE", label: "Farmhouse",  icon: Leaf },
];

const PRICE_PRESETS = [
  { label: "Any", min: "", max: "" },
  { label: "Under 50L", min: "", max: "5000000" },
  { label: "50L – 1Cr", min: "5000000", max: "10000000" },
  { label: "1Cr – 3Cr", min: "10000000", max: "30000000" },
  { label: "3Cr+", min: "30000000", max: "" },
];

export function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [listingType, setListingType] = useState("");
  const [category, setCategory] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Which price preset is active
  const activePricePreset = PRICE_PRESETS.findIndex(
    (p) => p.min === minPrice && p.max === maxPrice
  );

  const handlePricePreset = (preset: { min: string; max: string }) => {
    setMinPrice(preset.min);
    setMaxPrice(preset.max);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("city", location);
    if (listingType) params.append("type", listingType);
    if (category) params.append("category", category);
    if (bedrooms) params.append("bedrooms", bedrooms);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  const clearAll = () => {
    setLocation("");
    setListingType("");
    setCategory("");
    setBedrooms("");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasFilters = !!(location || listingType || category || bedrooms || minPrice || maxPrice);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-2xl shadow-primary-950/20 border border-white/60 p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3">

          {/* ── Row 1: Location + Type toggle + Search ── */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

            {/* Location */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type="text"
                placeholder="Search city, area or address..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-full border-0 bg-white pl-11 pr-4 py-3.5 text-sm font-medium text-primary-900 shadow-sm ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 transition-all placeholder:text-neutral-400"
              />
            </div>

            {/* Sale / Rent pill toggle */}
            <div className="flex rounded-full bg-neutral-100/80 p-1 shadow-inner ring-1 ring-inset ring-neutral-200/50 shrink-0">
              {[{ v: "", l: "All" }, { v: "SALE", l: "Sale" }, { v: "RENT", l: "Rent" }].map(({ v, l }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setListingType(v)}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                    listingType === v ? "bg-white shadow-sm text-primary-900" : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Advanced toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold rounded-full shrink-0 transition-all ${
                showAdvanced
                  ? "bg-primary-900 text-white"
                  : "bg-primary-50 text-primary-600 hover:bg-primary-100"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            {/* Search button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-accent-500 rounded-full hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/25 transition-all shrink-0 hover:-translate-y-0.5"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          {/* ── Row 2: Advanced Filters (collapsible) ── */}
          {showAdvanced && (
            <div className="border-t border-neutral-100 pt-3 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">

              {/* Category chips */}
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 pl-1">Property Type</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_CHIPS.map((c) => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategory(category === c.value ? "" : c.value)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                          category === c.value
                            ? "bg-primary-900 text-white border-primary-900 shadow-sm"
                            : "bg-white text-primary-700 border-neutral-200 hover:border-primary-300 hover:bg-primary-50"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bedrooms + Price row */}
              <div className="flex flex-col sm:flex-row gap-3">

                {/* Bedrooms */}
                <div className="flex flex-col gap-2 shrink-0">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Bedrooms</p>
                  <div className="flex gap-2">
                    {["", "1", "2", "3", "4", "5"].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBedrooms(b)}
                        className={`h-9 w-9 rounded-full text-xs font-bold transition-all border ${
                          bedrooms === b
                            ? "bg-primary-900 text-white border-primary-900"
                            : "bg-white text-primary-700 border-neutral-200 hover:border-primary-300 hover:bg-primary-50"
                        }`}
                      >
                        {b === "" ? "Any" : `${b}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price presets */}
                <div className="flex flex-col gap-2 flex-1">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Budget</p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_PRESETS.map((preset, i) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handlePricePreset(preset)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                          activePricePreset === i
                            ? "bg-primary-900 text-white border-primary-900 shadow-sm"
                            : "bg-white text-primary-700 border-neutral-200 hover:border-primary-300 hover:bg-primary-50"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear filters */}
              {hasFilters && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
