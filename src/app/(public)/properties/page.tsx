import prisma from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilters } from "@/components/property/property-filters";
import Link from "next/link";
import Image from "next/image";
import { Building2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Prisma } from "@prisma/client";
import type { Metadata } from "next";

import { z } from "zod";

export const metadata: Metadata = {
  title: "Browse Properties",
  description: "Discover our curated portfolio of premium houses, apartments, plots, and commercial spaces across Pakistan.",
};

const searchParamsSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  city: z.string().catch(""),
  type: z.enum(["SALE", "RENT"]).optional().catch(undefined),
  category: z.enum(["HOUSE", "APARTMENT", "PLOT", "COMMERCIAL", "FARMHOUSE", "VILLA", "BUILDING"]).optional().catch(undefined),
  bedrooms: z.coerce.number().int().nonnegative().optional().catch(undefined),
  minPrice: z.coerce.number().nonnegative().optional().catch(undefined),
  maxPrice: z.coerce.number().nonnegative().optional().catch(undefined),
});

// In Next.js 16 App Router, searchParams is passed as a Promise to the page component
export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the searchParams promise (Next.js 15+ requirement)
  const rawParams = await searchParams;
  
  // Extract first value if array, to flatten params for Zod
  const flatParams: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawParams)) {
    if (v !== undefined) {
      flatParams[k] = Array.isArray(v) ? v[0] : v;
    }
  }

  const parsed = searchParamsSchema.parse(flatParams);

  // Pagination config
  const ITEMS_PER_PAGE = 9;
  const page = parsed.page;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  // Build the Prisma "where" clause dynamically based on URL filters
  const whereClause: Prisma.PropertyWhereInput = {
    status: "AVAILABLE",
    isActive: true,
  };

  if (parsed.city) {
    whereClause.city = {
      contains: parsed.city,
      mode: "insensitive",
    };
  }

  if (parsed.type) {
    whereClause.type = parsed.type;
  }

  if (parsed.category) {
    whereClause.category = parsed.category;
  }

  if (parsed.bedrooms !== undefined) {
    whereClause.bedrooms = {
      gte: parsed.bedrooms,
    };
  }

  if (parsed.minPrice !== undefined || parsed.maxPrice !== undefined) {
    whereClause.price = {};
    if (parsed.minPrice !== undefined) {
      whereClause.price.gte = parsed.minPrice;
    }
    if (parsed.maxPrice !== undefined) {
      whereClause.price.lte = parsed.maxPrice;
    }
  }

  // Execute database queries in parallel
  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where: whereClause,
      take: ITEMS_PER_PAGE,
      skip: skip,
      orderBy: [{ label: "asc" }, { createdAt: "desc" }],
    }),
    prisma.property.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Check if any filters are active
  const hasActiveFilters = !!(parsed.city || parsed.type || parsed.category || parsed.bedrooms || parsed.minPrice || parsed.maxPrice);

  // Helper function to build pagination URLs
  const createPageUrl = (pageNumber: number) => {
    const urlParams = new URLSearchParams();
    Object.entries(flatParams).forEach(([key, value]) => {
      if (typeof value === "string") {
        urlParams.set(key, value);
      }
    });
    urlParams.set("page", pageNumber.toString());
    return `/properties?${urlParams.toString()}`;
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      
      {/* Hero Section */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=70"
          alt="Premium Real Estate Listings"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/75 to-primary-800/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent" />
        
        {/* Decorative glowing orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-500/15 border border-accent-400/30 backdrop-blur-sm px-5 py-2 text-xs font-bold text-accent-300 uppercase tracking-widest mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
            {totalCount} Active Listings
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-[0.95]">
            Find Your<br />
            <span className="text-accent-400">Dream Property</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Browse our handpicked portfolio of premium houses, apartments, and commercial spaces across Pakistan.
          </p>
        </div>
      </section>

      {/* Floating Filter Bar */}
      <div className="sticky top-20 z-40 -mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PropertyFilters />
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 pt-6">
        
        {/* Results header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-neutral-500 font-medium">
              {totalCount === 0
                ? "No listings found"
                : `Showing ${Math.min(skip + 1, totalCount)}–${Math.min(skip + ITEMS_PER_PAGE, totalCount)} of ${totalCount} listings`}
              {hasActiveFilters && (
                <span className="ml-2 inline-flex items-center rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-accent-700">
                  Filtered
                </span>
              )}
            </p>
          </div>
          {hasActiveFilters && (
            <Link
              href="/properties"
              className="text-sm font-semibold text-primary-600 hover:text-primary-900 transition-colors"
            >
              Clear all filters →
            </Link>
          )}
        </div>

        {/* Properties Grid or Empty State */}
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
            <div className="h-24 w-24 rounded-3xl bg-primary-50 flex items-center justify-center mb-6 shadow-sm">
              <Search className="h-12 w-12 text-primary-200" />
            </div>
            <h3 className="text-2xl font-extrabold text-primary-900 mb-3">No Properties Found</h3>
            <p className="text-neutral-500 max-w-sm leading-relaxed mb-8">
              We could not find any listings matching your current filters. Try broadening your search or clearing the filters.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary-900 px-8 py-4 text-sm font-bold text-white hover:bg-primary-800 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              View All Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <nav className="flex items-center gap-2 bg-white rounded-2xl shadow-sm border border-neutral-100 p-2">
              <Link
                href={page > 1 ? createPageUrl(page - 1) : "#"}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                  page <= 1
                    ? "pointer-events-none text-neutral-300"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Link>
              
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === page;
                  // Show first, last, current, and neighbors — ellipsis for others
                  const show =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - page) <= 1;
                  if (!show && (pageNum === 2 || pageNum === totalPages - 1)) {
                    return (
                      <span key={pageNum} className="text-neutral-400 font-bold text-sm w-9 text-center">
                        …
                      </span>
                    );
                  }
                  if (!show) return null;
                  return (
                    <Link
                      key={pageNum}
                      href={createPageUrl(pageNum)}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isCurrentPage
                          ? "bg-primary-900 text-white shadow-sm"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              <Link
                href={page < totalPages ? createPageUrl(page + 1) : "#"}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                  page >= totalPages
                    ? "pointer-events-none text-neutral-300"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        )}
      </section>
    </main>
  );
}
