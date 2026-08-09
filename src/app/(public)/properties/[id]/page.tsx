import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { getWatermarkedUrl } from "@/lib/cloudinary";
import { BedDouble, Bath, Square, MapPin, Tag, Calendar, User, Grid3x3 } from "lucide-react";
import { WhatsAppLeadModal } from "@/components/property/whatsapp-lead-modal";
import { UnitStatusGrid } from "@/components/inventory/unit-status-grid";

import type { Metadata } from "next";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    select: { title: true, description: true, images: true, city: true },
  });

  if (!property) return { title: "Property Not Found" };

  const description = property.description 
    ? (property.description.substring(0, 155) + "...") 
    : `View this premium property located in ${property.city} at Al-Arz Investments.`;
    
  return {
    title: property.title,
    description,
    openGraph: {
      title: property.title,
      description,
      images: property.images.length > 0 ? [{ url: getWatermarkedUrl(property.images[0]) }] : [],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  // In Next.js 15+, params is a Promise
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Fetch the property, including the assigned/created staff member details
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: { name: true, phone: true, email: true },
      },
      createdBy: {
        select: { name: true, phone: true, email: true },
      },
      inventory: {
        orderBy: [{ floor: "asc" }, { unitNumber: "asc" }],
        select: { id: true, unitNumber: true, floor: true, area: true, price: true, status: true },
      },
    },
  });

  if (!property || !property.isActive) {
    notFound();
  }

  // Format price
  const formattedPrice = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(property.price);

  // Fallback placeholder image if none uploaded
  const coverImage =
    property.images.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

  // Determine the primary staff member for this property (assignedTo takes precedence over createdBy)
  const staff = property.assignedTo || property.createdBy;

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Image Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full bg-neutral-900">
        <Image
          src={getWatermarkedUrl(coverImage)}
          alt={property.title}
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white shadow-sm uppercase tracking-wider">
                For {property.type}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-semibold text-white shadow-sm uppercase tracking-wider">
                {property.category}
              </span>
              {property.status !== "AVAILABLE" && (
                <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm uppercase tracking-wider">
                  {property.status}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
              {property.title}
            </h1>
            
            <div className="mt-4 flex items-center gap-2 text-primary-100">
              <MapPin className="h-5 w-5 shrink-0" />
              <p className="text-lg">
                {[property.address, property.phase, property.society, property.city].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Details (Left Column) */}
          <div className="flex-1 space-y-8">
            
            {/* Price & Quick Specs Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
              <div className="text-3xl sm:text-4xl font-bold text-primary-700 mb-8">
                {formattedPrice}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-neutral-100">
                {property.bedrooms !== null && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-neutral-500 mb-1">
                      <BedDouble className="h-5 w-5" />
                      <span className="text-sm font-medium uppercase tracking-wider">Bedrooms</span>
                    </div>
                    <span className="text-2xl font-bold text-neutral-900">{property.bedrooms}</span>
                  </div>
                )}
                
                {property.bathrooms !== null && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-neutral-500 mb-1">
                      <Bath className="h-5 w-5" />
                      <span className="text-sm font-medium uppercase tracking-wider">Bathrooms</span>
                    </div>
                    <span className="text-2xl font-bold text-neutral-900">{property.bathrooms}</span>
                  </div>
                )}

                {property.area !== null && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-neutral-500 mb-1">
                      <Square className="h-5 w-5" />
                      <span className="text-sm font-medium uppercase tracking-wider">Area</span>
                    </div>
                    <span className="text-2xl font-bold text-neutral-900">
                      {property.area} <span className="text-base font-normal text-neutral-500">sqft</span>
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm font-medium uppercase tracking-wider">Listed On</span>
                  </div>
                  <span className="text-lg font-semibold text-neutral-900">
                    {new Date(property.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <Tag className="h-6 w-6 text-primary-600" />
                Property Description
              </h2>
              <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {property.description || "No description provided for this property."}
              </div>
            </div>

            {/* Unit Availability Grid (only if property has inventory) */}
            {property.inventory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                  <Grid3x3 className="h-6 w-6 text-primary-600" />
                  Unit Availability
                </h2>
                <UnitStatusGrid units={property.inventory} />
              </div>
            )}
            
          </div>

          {/* Sidebar (Right Column) */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="sticky top-24 space-y-6">
              
              {/* Agent / WhatsApp Lead Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-6 overflow-hidden relative">
                {/* Decorative background shape */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary-50 opacity-50 pointer-events-none" />
                
                <h3 className="text-lg font-bold text-neutral-900 mb-6">Contact Agent</h3>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 text-lg">
                      {staff.name}
                    </p>
                    <p className="text-sm text-neutral-500">
                      Al-Arz Investments
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <WhatsAppLeadModal 
                    propertyId={property.id} 
                    propertyTitle={property.title}
                    staffPhone={staff.phone}
                  />
                </div>
                
                <p className="mt-6 text-xs text-center text-neutral-500 leading-relaxed">
                  By clicking Send Message, you agree to our Terms of Use and Privacy Policy. Your inquiry will be sent directly via WhatsApp.
                </p>
              </div>

            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
