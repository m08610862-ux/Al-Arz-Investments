import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Square, MapPin, Flame, Rocket, CheckCircle2, Circle } from "lucide-react";

import { getWatermarkedUrl } from "@/lib/cloudinary";
import { ImageCarousel } from "./image-carousel";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    type: string;
    category: string;
    city: string;
    society?: string | null;
    phase?: string | null;
    address: string;
    bedrooms: number | null;
    bathrooms: number | null;
    area: number | null;
    areaUnit: string;
    images: string[];
    status: string;
    label: string;
  };
  isSelected?: boolean;
  onToggleSelect?: (e: React.MouseEvent) => void;
}

export function PropertyCard({ property, isSelected, onToggleSelect }: PropertyCardProps) {
  // Format price to PKR
  const formattedPrice = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(property.price);

  // Fallback placeholder image
  const coverImage =
    property.images.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <Link 
      href={`/properties/${property.id}`}
      className={`group flex flex-col overflow-hidden rounded-[24px] bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 border ${isSelected ? 'border-green-500 shadow-green-500/20 shadow-xl' : 'border-transparent hover:border-primary-100 shadow-primary-900/5 hover:shadow-xl hover:shadow-primary-900/15'}`}
    >
      {/* Image Carousel */}
      <div className="relative">
        <ImageCarousel images={property.images} alt={property.title} />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-primary-900 shadow-sm uppercase tracking-widest">
            For {property.type}
          </span>
          {property.status !== "AVAILABLE" && (
            <span className="inline-flex items-center rounded-full bg-red-500/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-white shadow-sm uppercase tracking-widest">
              {property.status}
            </span>
          )}
          {property.label === "SUPER_HOT" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] uppercase tracking-widest animate-pulse">
              <Rocket className="h-3 w-3" /> Super Hot
            </span>
          )}
          {property.label === "HOT" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] uppercase tracking-widest">
              <Flame className="h-3 w-3" /> Hot
            </span>
          )}
        </div>

        {/* Selection Checkbox (if enabled) */}
        {onToggleSelect && (
          <button
            onClick={onToggleSelect}
            className="absolute top-4 right-4 z-10 p-1 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:scale-110 transition-transform"
            title={isSelected ? "Deselect property" : "Select property"}
          >
            {isSelected ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <Circle className="h-6 w-6 text-neutral-400 hover:text-green-500" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-xs text-primary-500 font-semibold uppercase tracking-wider mb-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1 text-[10px] leading-tight">
                {[property.address, property.phase, property.society, property.city].filter(Boolean).join(", ")}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-primary-950 line-clamp-1 group-hover:text-accent-600 transition-colors leading-tight">
              {property.title}
            </h3>
          </div>
        </div>
        
        <p className="text-2xl font-black text-accent-500 mb-6 tracking-tight">
          {formattedPrice}
        </p>

        {/* Features Row */}
        <div className="flex items-center gap-5 mt-auto pt-5 border-t border-primary-50/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
              <BedDouble className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-primary-900">
              {property.bedrooms || "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
              <Bath className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-primary-900">
              {property.bathrooms || "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
              <Square className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-primary-900">
              {property.area ? `${property.area} ${property.areaUnit?.toLowerCase() || 'marla'}` : "-"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
