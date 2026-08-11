"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getWatermarkedUrl } from "@/lib/cloudinary";

const FALLBACK = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  /** If true, renders a taller hero-style slider (for property detail page) */
  hero?: boolean;
  /** If true, arrows are always visible (not just on hover) */
  showArrows?: boolean;
}

export function ImageCarousel({ images, alt, hero = false, showArrows = false }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const list = images.length > 0 ? images : [FALLBACK];

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c - 1 + list.length) % list.length);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c + 1) % list.length);
  };

  const goTo = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(i);
  };

  return (
    <div className={`relative overflow-hidden bg-neutral-100 ${hero ? "h-[55vh] min-h-[380px] w-full" : "aspect-[4/3]"}`}>
      {/* Images */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * (100 / list.length)}%)`, width: `${list.length * 100}%` }}
      >
        {list.map((url, i) => (
          <div key={i} className="relative h-full shrink-0" style={{ width: `${100 / list.length}%` }}>
            <Image
              src={hero ? getWatermarkedUrl(url) : getWatermarkedUrl(url)}
              alt={`${alt} — image ${i + 1}`}
              fill
              className={`object-cover ${hero ? "opacity-80" : "transition-transform duration-700 group-hover:scale-110"}`}
              sizes={hero ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      {hero && <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent pointer-events-none" />}

      {/* Arrows — only show when more than 1 image */}
      {list.length > 1 && (
        <>
          <button
            onClick={prev}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all ${
              hero || showArrows
                ? "h-10 w-10"
                : "h-7 w-7 opacity-0 group-hover:opacity-100"
            }`}
            aria-label="Previous image"
          >
            <ChevronLeft className={hero || showArrows ? "h-5 w-5" : "h-4 w-4"} />
          </button>
          <button
            onClick={next}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all ${
              hero || showArrows
                ? "h-10 w-10"
                : "h-7 w-7 opacity-0 group-hover:opacity-100"
            }`}
            aria-label="Next image"
          >
            <ChevronRight className={hero || showArrows ? "h-5 w-5" : "h-4 w-4"} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {list.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={(e) => goTo(e, i)}
              className={`rounded-full transition-all ${
                i === current
                  ? "bg-white w-4 h-1.5"
                  : "bg-white/50 w-1.5 h-1.5 hover:bg-white/80"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter badge (hero only) */}
      {hero && list.length > 1 && (
        <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {current + 1} / {list.length}
        </div>
      )}
    </div>
  );
}
