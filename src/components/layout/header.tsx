"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, ChevronDown, Key, MapPin, Building2, Briefcase, TrendingUp, ArrowRight } from "lucide-react";

const navBefore = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
];

const navAfter = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const services = [
  {
    name: "Houses for Sale/Purchase",
    href: "/services/houses-for-sale",
    icon: Key,
    description: "End-to-end brokerage with full legal scrutiny & paperwork.",
  },
  {
    name: "Residential & Commercial Plots",
    href: "/services/residential-commercial-plots",
    icon: MapPin,
    description: "High-growth plots in DHA, Bahria Town & Gulberg.",
  },
  {
    name: "Commercial Properties",
    href: "/services/commercial-properties",
    icon: Building2,
    description: "Prime offices, retail shops & showrooms across Pakistan.",
  },
  {
    name: "Construction & Maintenance",
    href: "/services/construction-maintenance",
    icon: Briefcase,
    description: "Turnkey grey structures, luxury finishes & ongoing upkeep.",
  },
  {
    name: "Investments Consultancy",
    href: "/services/investments-consultancy",
    icon: TrendingUp,
    description: "Data-driven investment advice, risk mitigation & ROI strategy.",
  },
];

export function Header({ siteSettings }: { siteSettings: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleServicesEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setServicesOpen(true);
  };

  const handleServicesLeave = () => {
    leaveTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  const isServicesActive = pathname.startsWith("/services");

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-primary-100 shadow-sm transition-all">
      {/* Top Bar */}
      <div className="hidden md:block bg-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between text-xs font-medium tracking-wide">
            <div className="flex items-center gap-6">
              <a
                href={`tel:${(siteSettings?.phone || "").replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-2 text-primary-200 hover:text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {siteSettings?.phone}
              </a>
              <a
                href={`mailto:${siteSettings?.email}`}
                className="flex items-center gap-2 text-primary-200 hover:text-white transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                {siteSettings?.email}
              </a>
            </div>
            <div className="text-primary-300">Pakistan&apos;s Premium Real Estate Partner</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="h-16 md:h-20 w-auto transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Al-Arz Logo"
                width={240}
                height={96}
                quality={100}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            {navBefore.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center h-full text-sm font-bold transition-colors ${
                    isActive ? "text-accent-500" : "text-primary-600 hover:text-primary-900"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-accent-500 rounded-t-full" />
                  )}
                </Link>
              );
            })}

            {/* Services Dropdown Trigger */}
            <div
              className="relative flex items-center h-full"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button
                className={`relative flex items-center gap-1.5 h-full text-sm font-bold transition-colors ${
                  isServicesActive ? "text-accent-500" : "text-primary-600 hover:text-primary-900"
                }`}
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                />
                {isServicesActive && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-accent-500 rounded-t-full" />
                )}
              </button>

              {/* Mega Dropdown */}
              {servicesOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[620px] bg-white rounded-2xl shadow-2xl shadow-primary-900/15 border border-primary-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={handleServicesEnter}
                  onMouseLeave={handleServicesLeave}
                >
                  <div className="p-5">
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-4 px-1">
                      What We Offer
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {services.map((service) => {
                        const Icon = service.icon;
                        const isActive = pathname === service.href;
                        return (
                          <Link
                            key={service.href}
                            href={service.href}
                            onClick={() => setServicesOpen(false)}
                            className={`flex items-start gap-3.5 p-4 rounded-xl group transition-all ${
                              isActive
                                ? "bg-accent-50 border border-accent-100"
                                : "hover:bg-primary-50 border border-transparent hover:border-primary-100"
                            }`}
                          >
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                              isActive
                                ? "bg-accent-500 text-white"
                                : "bg-primary-100 text-primary-600 group-hover:bg-primary-900 group-hover:text-white"
                            }`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 pt-0.5">
                              <p className={`text-sm font-bold leading-tight mb-1 ${
                                isActive ? "text-accent-600" : "text-primary-900"
                              }`}>
                                {service.name}
                              </p>
                              <p className="text-xs text-primary-400 leading-relaxed line-clamp-2">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* After Services: About, Contact */}
            {navAfter.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center h-full text-sm font-bold transition-colors ${
                    isActive ? "text-accent-500" : "text-primary-600 hover:text-primary-900"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-accent-500 rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-accent-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-accent-500/20 hover:bg-accent-600 active:bg-accent-700 hover:-translate-y-0.5 transition-all"
            >
              Contact Agent
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2.5 text-primary-600 hover:bg-primary-50 hover:text-primary-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary-100 bg-white/95 backdrop-blur-md absolute w-full animate-in slide-in-from-top-2 shadow-xl">
          <div className="px-4 py-6 space-y-2">
            {/* Home, Properties */}
            {navBefore.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3.5 text-base font-bold transition-colors ${
                    isActive ? "bg-accent-50 text-accent-600" : "text-primary-700 hover:bg-primary-50 hover:text-primary-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Services Accordion */}
            <div>
              <button
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-bold transition-colors ${
                  isServicesActive ? "bg-accent-50 text-accent-600" : "text-primary-700 hover:bg-primary-50"
                }`}
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                Services
                <ChevronDown className={`h-5 w-5 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileServicesOpen && (
                <div className="mt-1 ml-4 space-y-1 border-l-2 border-primary-100 pl-4">
                  <Link
                    href="/services"
                    className="block rounded-lg px-3 py-2.5 text-sm font-bold text-accent-600 hover:bg-accent-50 transition-colors"
                    onClick={() => { setMobileMenuOpen(false); setMobileServicesOpen(false); }}
                  >
                    All Services →
                  </Link>
                  {services.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-50 hover:text-primary-900 transition-colors"
                        onClick={() => { setMobileMenuOpen(false); setMobileServicesOpen(false); }}
                      >
                        <Icon className="h-4 w-4 text-accent-500 shrink-0" />
                        {s.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* About, Contact — after Services */}
            {navAfter.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3.5 text-base font-bold transition-colors ${
                    isActive ? "bg-accent-50 text-accent-600" : "text-primary-700 hover:bg-primary-50 hover:text-primary-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-6 mt-4 border-t border-primary-100">
              <Link
                href="/contact"
                className="block w-full text-center rounded-xl bg-accent-500 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-accent-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Agent
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
