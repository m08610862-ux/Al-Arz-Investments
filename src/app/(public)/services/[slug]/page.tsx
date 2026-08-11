import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowRight, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import prisma from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";
import { getService, services } from "@/config/services";

// Generate static params for all 5 slugs
export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const Icon = service.icon;

  // Fetch related properties
  const relatedProperties = await prisma.property.findMany({
    where: {
      status: "AVAILABLE",
      ...(service.propertyFilter.categories
        ? { category: { in: service.propertyFilter.categories } }
        : {}),
      ...(service.propertyFilter.label
        ? { label: service.propertyFilter.label }
        : {}),
    },
    orderBy:
      service.propertyFilter.orderBy === "newest"
        ? { createdAt: "desc" }
        : service.propertyFilter.orderBy === "label"
        ? [{ label: "desc" }, { createdAt: "desc" }]
        : { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      price: true,
      type: true,
      category: true,
      city: true,
      address: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      areaUnit: true,
      images: true,
      status: true,
      label: true,
    },
  });

  return (
    <main className="min-h-screen">
      {/* ── 1. HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[580px] flex items-center overflow-hidden">
        <Image
          src={service.heroImage}
          alt={service.name}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-primary-900/80" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-primary-300 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <span>/</span>
              <span className="text-white">{service.name}</span>
            </div>

            {/* Icon badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 mb-6">
              <Icon className="h-5 w-5 text-accent-300" />
              <span className="text-sm font-semibold text-white">Our Services</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {service.name}
            </h1>
            <p className="text-xl text-primary-200 leading-relaxed mb-10 max-w-2xl">
              {service.tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-accent-500/20"
              >
                Browse Properties
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl border border-white/20 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                Contact an Agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS STRIP ─────────────────────────────────────── */}
      <section className="bg-white border-b border-primary-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-primary-100">
            {service.stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center py-8 sm:py-10 px-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-primary-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-bold text-primary-500 uppercase tracking-widest mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHAT WE OFFER ───────────────────────────────────── */}
      <section className="py-24 bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-4 block">
                What We Offer
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mb-6">
                Everything you need, all in one place
              </h2>
              <p className="text-lg text-primary-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Right — Bullets */}
            <div className="space-y-6">
              {service.bullets.map((bullet, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 h-6 w-6 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-900 mb-1">
                      {bullet.title}
                    </h3>
                    <p className="text-primary-600 leading-relaxed">
                      {bullet.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-4 block">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
              How It Works
            </h2>
            <p className="mt-4 text-primary-600 max-w-xl mx-auto">
              A clear, transparent process from start to finish — so you always know what to expect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-primary-200 z-0" />

            {service.steps.map((step) => (
              <div key={step.step} className="relative flex flex-col items-center text-center z-10">
                {/* Step circle */}
                <div className="h-20 w-20 rounded-full bg-primary-900 text-white flex items-center justify-center text-2xl font-black mb-6 shadow-lg border-4 border-white">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-2">{step.title}</h3>
                <p className="text-sm text-primary-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. RELATED PROPERTIES ──────────────────────────────── */}
      {relatedProperties.length > 0 && (
        <section className="py-24 bg-primary-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-3 block">
                  Available Now
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
                  Related Properties
                </h2>
              </div>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-accent-600 transition-colors"
              >
                View All Listings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. BOTTOM CTA ──────────────────────────────────────── */}
      <section className="py-24 bg-primary-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Icon className="h-14 w-14 text-accent-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-primary-300 mb-10 max-w-xl mx-auto">
            Our expert agents are available to guide you through every step. Reach out today for a free, no-obligation consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`https://wa.me/923000000000?text=Hi, I'm interested in your ${encodeURIComponent(service.name)} service.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl border border-white/20 transition-all"
            >
              <Phone className="h-5 w-5" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
