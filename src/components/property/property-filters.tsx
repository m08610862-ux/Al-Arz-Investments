"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, MapPin, Filter, Home, BedDouble, ChevronDown } from "lucide-react";

export function PropertyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state to hold filter values before applying
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");

  // Advanced filters toggle for mobile or extra filters
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync state if URL changes (e.g. going back)
  useEffect(() => {
    setCity(searchParams.get("city") || "");
    setType(searchParams.get("type") || "");
    setCategory(searchParams.get("category") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setBedrooms(searchParams.get("bedrooms") || "");
  }, [searchParams]);

  const applyFilters = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      
      const params = new URLSearchParams(searchParams.toString());
      
      // Reset page when filtering
      params.set("page", "1");

      if (city) params.set("city", city);
      else params.delete("city");

      if (type) params.set("type", type);
      else params.delete("type");

      if (category) params.set("category", category);
      else params.delete("category");

      if (minPrice) params.set("minPrice", minPrice);
      else params.delete("minPrice");

      if (maxPrice) params.set("maxPrice", maxPrice);
      else params.delete("maxPrice");

      if (bedrooms) params.set("bedrooms", bedrooms);
      else params.delete("bedrooms");

      router.push(`${pathname}?${params.toString()}`);
    },
    [city, type, category, minPrice, maxPrice, bedrooms, pathname, router, searchParams]
  );

  const clearFilters = () => {
    setCity("");
    setType("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    router.push(pathname);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-lg shadow-primary-900/5 border border-white p-4 mb-8 sticky top-24 z-30 transition-all">
      <form onSubmit={applyFilters} className="flex flex-col xl:flex-row gap-4 xl:items-center">
        
        {/* Main Search Bar (Location) */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary-400" />
          </div>
          <input
            type="text"
            placeholder="Search by city, location..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-full border-0 bg-white pl-11 pr-4 py-3.5 text-sm font-medium text-primary-900 shadow-sm ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 transition-all placeholder:text-neutral-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap xl:flex-nowrap gap-3 items-center">
          
          {/* Listing Type Pill Toggle */}
          <div className="flex rounded-full bg-neutral-100/80 p-1 shadow-inner ring-1 ring-inset ring-neutral-200/50">
            <button
              type="button"
              onClick={() => setType("")}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                type === "" ? "bg-white shadow-sm text-primary-900" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setType("SALE")}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                type === "SALE" ? "bg-white shadow-sm text-primary-900" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Sale
            </button>
            <button
              type="button"
              onClick={() => setType("RENT")}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                type === "RENT" ? "bg-white shadow-sm text-primary-900" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Rent
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative shrink-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none rounded-full border-0 bg-white pl-5 pr-10 py-3.5 text-sm font-semibold text-primary-900 shadow-sm ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 transition-all"
            >
              <option value="">All Types</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="BUILDING">Building</option>
              <option value="PLOT">Plot</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="FARMHOUSE">Farmhouse</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400 pointer-events-none" />
          </div>

          {/* Bedrooms Dropdown */}
          <div className="relative shrink-0">
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="appearance-none rounded-full border-0 bg-white pl-5 pr-10 py-3.5 text-sm font-semibold text-primary-900 shadow-sm ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 transition-all"
            >
              <option value="">Beds (Any)</option>
              <option value="1">1+ Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400 pointer-events-none" />
          </div>
          
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors shrink-0"
          >
            <Filter className="h-4 w-4" />
            Price
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-3.5 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors shrink-0"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-3.5 text-sm font-bold text-white bg-accent-500 rounded-full hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/25 transition-all shrink-0 hover:-translate-y-0.5"
            >
              Search
            </button>
          </div>
        </div>

        {/* Advanced / Price Filters (Collapsible) */}
        {showAdvanced && (
          <div className="xl:absolute xl:top-full xl:right-0 xl:mt-4 xl:w-80 bg-white rounded-2xl shadow-xl border border-neutral-100 p-5 z-40 animate-in slide-in-from-top-2 fade-in duration-200 w-full mt-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-primary-900">Price Range (Rs)</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-xl border-0 bg-neutral-50 px-3 py-2.5 text-sm font-medium text-primary-900 ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">Max Price</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-xl border-0 bg-neutral-50 px-3 py-2.5 text-sm font-medium text-primary-900 ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 transition-all"
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAdvanced(false);
                  applyFilters();
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors w-full"
              >
                Apply Price
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
