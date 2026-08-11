"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

const CITIES    = ["Rawalpindi", "Islamabad"];
const SOCIETIES = ["DHA", "Bahria Town"];
const PHASES    = ["Phase 1","Phase 2","Phase 3","Phase 4","Phase 5","Phase 6","Phase 7","Phase 8"];

export function PropertyFilters() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const [query,   setQuery]   = useState(searchParams.get("query")   || "");
  const [city,    setCity]    = useState(searchParams.get("city")    || "");
  const [society, setSociety] = useState(searchParams.get("society") || "");
  const [phase,   setPhase]   = useState(searchParams.get("phase")   || "");
  const [type,    setType]    = useState(searchParams.get("type")    || "");
  const [category,setCategory]= useState(searchParams.get("category")|| "");
  const [minPrice,setMinPrice]= useState(searchParams.get("minPrice")|| "");
  const [maxPrice,setMaxPrice]= useState(searchParams.get("maxPrice")|| "");
  const [bedrooms,setBedrooms]= useState(searchParams.get("bedrooms")|| "");
  const [showPrice, setShowPrice] = useState(false);

  useEffect(() => {
    setQuery   (searchParams.get("query")   || "");
    setCity    (searchParams.get("city")    || "");
    setSociety (searchParams.get("society") || "");
    setPhase   (searchParams.get("phase")   || "");
    setType    (searchParams.get("type")    || "");
    setCategory(searchParams.get("category")|| "");
    setMinPrice(searchParams.get("minPrice")|| "");
    setMaxPrice(searchParams.get("maxPrice")|| "");
    setBedrooms(searchParams.get("bedrooms")|| "");
  }, [searchParams]);

  const applyFilters = useCallback(
    (e?: React.FormEvent, override?: { key: string; value: string }) => {
      if (e && e.preventDefault) e.preventDefault();
      setShowPrice(false);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");

      const state: Record<string, string> = { query, city, society, phase, type, category, minPrice, maxPrice, bedrooms };
      if (override) {
        state[override.key] = override.value;
      }

      if (state.query)    params.set("query", state.query);       else params.delete("query");
      if (state.city)     params.set("city", state.city);         else params.delete("city");
      if (state.society)  params.set("society", state.society);   else params.delete("society");
      if (state.phase)    params.set("phase", state.phase);       else params.delete("phase");
      if (state.type)     params.set("type", state.type);         else params.delete("type");
      if (state.category) params.set("category", state.category); else params.delete("category");
      if (state.minPrice) params.set("minPrice", state.minPrice); else params.delete("minPrice");
      if (state.maxPrice) params.set("maxPrice", state.maxPrice); else params.delete("maxPrice");
      if (state.bedrooms) params.set("bedrooms", state.bedrooms); else params.delete("bedrooms");

      const targetPath = pathname === "/properties" ? pathname : "/properties";
      router.push(`${targetPath}?${params.toString()}`);
    },
    [query, city, society, phase, type, category, minPrice, maxPrice, bedrooms, pathname, router, searchParams]
  );

  const clearFilters = () => {
    setQuery(""); setCity(""); setSociety(""); setPhase(""); setType("");
    setCategory(""); setMinPrice(""); setMaxPrice(""); setBedrooms("");
    const targetPath = pathname === "/properties" ? pathname : "/properties";
    router.push(targetPath);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 transition-all">
      <form onSubmit={applyFilters} className="flex flex-col gap-4">

        {/* ── ROW 1: Main Search Bar ── */}
        <div className="flex bg-white/90 backdrop-blur-md rounded-full shadow-xl shadow-primary-950/10 p-1.5 border border-white/50">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-6 h-5 w-5 text-primary-400" />
            <input
              type="text"
              placeholder="Search by city, society, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-0 bg-transparent pl-14 pr-4 py-3.5 text-base font-medium text-primary-900 outline-none focus:outline-none focus:ring-0 placeholder:text-neutral-400"
            />
            {query && (
              <button 
                type="button" 
                onClick={() => setQuery("")}
                className="absolute right-4 text-neutral-400 hover:text-neutral-600"
              >
                <Filter className="h-4 w-4 hidden" /> {/* Just for spacing or use X icon */}
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 text-sm font-bold text-white bg-accent-500 rounded-full hover:bg-accent-600 shadow-md hover:shadow-lg hover:shadow-accent-500/25 transition-all shrink-0 ml-2"
          >
            Search
          </button>
        </div>

        {/* ── ROW 2: Filter Pills ── */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 justify-center px-1">
          
          {/* Sale / Rent Toggle */}
          <div className="flex rounded-full bg-white/60 backdrop-blur-md p-1 shadow-sm border border-white/40 shrink-0">
            {[{ v: "", l: "All" }, { v: "SALE", l: "Sale" }, { v: "RENT", l: "Rent" }, { v: "INVESTMENT", l: "Investment" }].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => { setType(v); applyFilters(undefined, { key: "type", value: v }); }}
                className={`px-3.5 py-1.5 text-[11px] font-bold rounded-full transition-all ${
                  type === v ? "bg-primary-900 text-white shadow-sm" : "text-primary-700 hover:text-primary-900 hover:bg-white/50"
                }`}>
                {l}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-white/40 mx-0.5 hidden lg:block"></div>

          {/* Filter Dropdowns */}
          {[
            {
              label: "City",
              val: city,
              set: setCity,
              options: CITIES.map(c => ({ value: c, label: c }))
            },
            {
              label: "Society",
              val: society,
              set: setSociety,
              options: SOCIETIES.map(s => ({ value: s, label: s }))
            },
            {
              label: "Phase",
              val: phase,
              set: setPhase,
              options: PHASES.map(p => ({ value: p, label: p }))
            },
            {
              label: "Type",
              val: category,
              set: setCategory,
              options: [
                { value: "HOUSE", label: "House" },
                { value: "APARTMENT", label: "Apartment" },
                { value: "VILLA", label: "Villa" },
                { value: "PLOT", label: "Plot" },
                { value: "COMMERCIAL", label: "Commercial" },
                { value: "SHOP", label: "Shop" },
                { value: "FARMHOUSE", label: "Farm House" }
              ]
            },
            {
              label: "Beds",
              val: bedrooms,
              set: setBedrooms,
              options: [1, 2, 3, 4, 5].map(b => ({ value: b.toString(), label: `${b}+ Beds` }))
            }
          ].map((filter, idx) => (
            <div key={idx} className="relative group shrink-0">
              <select
                value={filter.val}
                onChange={(e) => { 
                  filter.set(e.target.value); 
                  // Map the visual label to the actual state key used in applyFilters
                  let stateKey = filter.label.toLowerCase();
                  if (filter.label === "Type") stateKey = "category"; // We labeled Property Category as "Type"
                  if (filter.label === "Beds") stateKey = "bedrooms";
                  applyFilters(undefined, { key: stateKey, value: e.target.value });
                }}
                className={`appearance-none cursor-pointer rounded-full border border-white/40 backdrop-blur-md pl-3 pr-7 py-1.5 text-[11px] font-bold transition-all outline-none focus:ring-2 focus:ring-accent-500 shadow-sm ${
                  filter.val ? "bg-primary-900 text-white border-primary-900" : "bg-white/80 text-primary-800 hover:bg-white"
                }`}
              >
                <option value="">{filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none transition-colors ${
                filter.val ? "text-white/70" : "text-primary-500 group-hover:text-primary-900"
              }`} />
            </div>
          ))}

          {/* Price Button */}
          <div className="relative shrink-0">
            <button type="button" onClick={() => setShowPrice(!showPrice)}
              className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-full border backdrop-blur-md shadow-sm transition-all ${
                minPrice || maxPrice 
                  ? "bg-primary-900 text-white border-primary-900" 
                  : "bg-white/80 text-primary-800 border-white/40 hover:bg-white"
              }`}>
              Price
              <ChevronDown className={`h-3.5 w-3.5 ${minPrice || maxPrice ? "text-white/70" : "text-primary-500"}`} />
            </button>
            {showPrice && (
              <div className="absolute top-full left-0 md:right-0 md:left-auto mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-100 p-5 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                <h4 className="font-bold text-primary-900 mb-4 text-sm">Price Range (Rs)</h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Min</label>
                    <input type="number" placeholder="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full rounded-xl border-0 bg-neutral-50 px-3 py-2.5 text-sm font-medium text-primary-900 outline-none focus:outline-none ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Max</label>
                    <input type="number" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full rounded-xl border-0 bg-neutral-50 px-3 py-2.5 text-sm font-medium text-primary-900 outline-none focus:outline-none ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 transition-all" />
                  </div>
                </div>
                <button type="button" onClick={() => { setShowPrice(false); applyFilters(); }}
                  className="px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors w-full">
                  Apply Price
                </button>
              </div>
            )}
          </div>

          {/* Clear Button */}
          {(query || city || type || category || minPrice || maxPrice || bedrooms || society || phase) && (
            <button type="button" onClick={clearFilters}
              className="ml-auto md:ml-2 px-3 py-2 text-xs font-bold text-white/70 hover:text-white transition-colors underline decoration-white/30 underline-offset-4">
              Clear filters
            </button>
          )}

        </div>
      </form>
    </div>
  );
}
