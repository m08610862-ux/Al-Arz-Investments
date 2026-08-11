"use client";

import { useState } from "react";
import { PropertyCard } from "./property-card";
import { MessageCircle, X } from "lucide-react";

const FALLBACK_BUSINESS_NUMBER = "923300276999";

interface PropertyData {
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
  images: string[];
  status: string;
  label: string;
}

export function PropertyGridClient({ properties }: { properties: PropertyData[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleToggleSelect = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleBulkWhatsApp = () => {
    // Get full property objects for selected IDs
    const selectedProperties = properties.filter((p) => selectedIds.has(p.id));
    if (selectedProperties.length === 0) return;

    // Construct WhatsApp message
    const baseUrl = window.location.origin;
    let message = `*New Multi-Property Inquiry*\n\nI am interested in the following properties:\n\n`;

    selectedProperties.forEach((p, index) => {
      message += `${index + 1}. *${p.title}*\n   Link: ${baseUrl}/properties/${p.id}\n\n`;
    });

    message += `Please provide more details.\n\n_Sent via Al-Arz Investments_`;

    const waUrl = `https://wa.me/${FALLBACK_BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    
    // Clear selection after opening
    handleClearSelection();
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
        {properties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property as any} 
            isSelected={selectedIds.has(property.id)}
            onToggleSelect={(e) => handleToggleSelect(e, property.id)}
          />
        ))}
      </div>

      {/* Floating Action Button */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-white rounded-full shadow-2xl shadow-primary-900/20 border border-neutral-100 p-2 flex items-center gap-2">
            <div className="px-4 py-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                {selectedIds.size}
              </span>
              <span className="text-sm font-semibold text-neutral-700 hidden sm:inline-block">
                Properties Selected
              </span>
            </div>

            <div className="h-6 w-px bg-neutral-200" />

            <button
              onClick={handleBulkWhatsApp}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Inquire Now
            </button>

            <button
              onClick={handleClearSelection}
              className="p-2.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
