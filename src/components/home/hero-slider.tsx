"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=70",
    alt: "Luxury Home Exterior",
    badge: "Pakistan's Premium Real Estate Partner",
    headline: "Find Your",
    highlight: "Dream Home",
    sub: "Discover premium properties across Pakistan — from luxurious homes to high-yield investments. Let Al-Arz Investments guide you home.",
  },
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=70",
    alt: "Modern Villa with Pool",
    badge: "Exclusive Listings in Top Societies",
    headline: "Invest in",
    highlight: "Your Future",
    sub: "Secure your financial future with the right real estate investment. We specialize in DHA, Bahria Town, and Gulberg.",
  },
  {
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=70",
    alt: "Premium Property Interior",
    badge: "Trusted by Thousands Across Pakistan",
    headline: "Premium",
    highlight: "Real Estate",
    sub: "From residential plots to commercial towers — Al-Arz Investments delivers transparency, trust, and proven results every time.",
  },
];

export function HeroSlider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  }, [animating]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  // Auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative min-h-[580px] sm:min-h-[680px] lg:min-h-[720px] flex items-center justify-center">

      {/* Background Layer (clipping bounds for images/orb) */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Background Images */}
        {slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 z-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
          >
            <Image
              src={s.image}
              alt={s.alt}
              fill
              className="object-cover object-center scale-105"
              sizes="100vw"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/80 to-primary-800/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent" />
          </div>
        ))}

        {/* Glowing accent orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-accent-500/8 rounded-full blur-[140px] pointer-events-none z-[1]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 flex flex-col items-center text-center">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/20 border border-white/50 backdrop-blur-sm px-3 sm:px-6 py-1.5 sm:py-2.5 text-[10px] sm:text-sm font-bold text-white uppercase tracking-widest mb-5 sm:mb-8 transition-all duration-500 shadow-lg max-w-[90vw]"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)" }}
        >
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white animate-pulse shrink-0" />
          <Building2 className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
          <span className="truncate">{slide.badge}</span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-[0.95] mb-4 sm:mb-6 transition-all duration-500"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "translateY(0)" }}
        >
          {slide.headline}<br />
          <span className="text-accent-400">{slide.highlight}</span>
        </h1>

        {/* Subheadline */}
        <p
          className="mt-2 sm:mt-4 text-sm sm:text-lg lg:text-xl text-white leading-relaxed max-w-xs sm:max-w-2xl font-medium transition-all duration-500"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)", transitionDelay: "60ms" }}
        >
          {slide.sub}
        </p>

        {/* Search Bar (static) */}
        <div className="mt-8 sm:mt-12 w-full max-w-4xl mx-auto">
          {children}
        </div>

        {/* Slide Dots */}
        <div className="mt-6 sm:mt-10 flex items-center gap-2 sm:gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 7,
                height: 7,
                background: i === current ? "rgb(61 114 175)" : "rgba(255,255,255,0.3)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </section>
  );
}
