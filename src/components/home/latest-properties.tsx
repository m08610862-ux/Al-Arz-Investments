import prisma from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function LatestProperties() {
  const properties = await prisma.property.findMany({
    where: {
      status: "AVAILABLE",
      isActive: true,
    },
    take: 6,
    orderBy: { createdAt: "desc" }
  });

  if (properties.length === 0) return null;

  return (
    <section className="py-20 sm:py-24 bg-primary-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight">
              Latest Properties
            </h2>
            <p className="mt-4 text-lg text-primary-600 max-w-2xl">
              Explore our newest listings of premium properties across Pakistan.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
