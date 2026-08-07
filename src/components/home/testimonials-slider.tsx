"use client";

import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string | null;
  rating: number;
}

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
}

export function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
  if (testimonials.length === 0) return null;

  // We need enough items to fill the screen width so the marquee doesn't look empty.
  // We'll duplicate the array until it has at least 6-8 items.
  let baseArray = [...testimonials];
  while (baseArray.length < 8) {
    baseArray = [...baseArray, ...testimonials];
  }

  // For a perfect continuous CSS loop with translateX(-50%), 
  // the container must be split into two perfectly identical halves.
  const scrollingItems = [...baseArray, ...baseArray];

  return (
    <div className="relative w-full max-w-[100vw] overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
      {/* 
        Hovering the track pauses the animation.
        group/track allows us to use group-hover:*:pause (conceptually) or just standard CSS hover.
        In globals.css we can define:
        .animate-marquee:hover { animation-play-state: paused; }
        Or use a utility class if available. We'll rely on the standard CSS inline style or tailwind arbitrary variants if needed, but a simple class `hover:[animation-play-state:paused]` works.
      */}
      <div 
        className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-6 sm:gap-8"
      >
        {scrollingItems.map((t, idx) => (
          <div
            key={`${t.id}-${idx}`}
            className="relative flex flex-col w-[320px] sm:w-[400px] shrink-0 bg-white rounded-3xl p-8 sm:p-10 border border-primary-100 shadow-sm transition-shadow hover:shadow-lg"
          >
            <Quote className="absolute top-6 right-6 h-8 w-8 text-primary-100" strokeWidth={2} />
            
            {/* Quote content */}
            <div className="flex-1 mb-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-primary-100"}`}
                  />
                ))}
              </div>
              <p className="text-base sm:text-lg font-medium text-primary-800 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="h-12 w-12 rounded-full bg-primary-700 shrink-0 flex items-center justify-center border-2 border-primary-50">
                <span className="text-lg font-bold text-white">
                  {t.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex flex-col">
                <h4 className="font-bold text-primary-900 leading-tight">{t.name}</h4>
                <p className="text-xs font-bold text-accent-500 uppercase tracking-widest mt-0.5">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fade gradients on edges for a smoother look */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-primary-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-primary-50 to-transparent" />
    </div>
  );
}
