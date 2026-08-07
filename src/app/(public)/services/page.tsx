import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { services } from "@/config/services";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore Al-Arz Investments' comprehensive real estate services — from buying homes and plots to construction, commercial properties, and investment consultancy.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 sm:py-44 overflow-hidden flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Our Services"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-primary-900/80" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-accent-300 font-bold tracking-wider uppercase text-sm mb-4 block">
            What We Do
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">Our Services</h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            Comprehensive real estate solutions — from buying your first home to growing your investment portfolio.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const isLast = idx === services.length - 1;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className={`group relative overflow-hidden rounded-3xl min-h-[320px] ${
                    isLast ? "md:col-span-2" : ""
                  }`}
                >
                  <Image
                    src={service.heroImage}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes={isLast ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-primary-900/10 group-hover:from-primary-900/95 transition-all duration-500" />
                  <div className={`absolute inset-0 p-8 sm:p-10 flex flex-col justify-end ${isLast ? "max-w-2xl" : ""}`}>
                    <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 border border-white/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{service.name}</h2>
                    <p className="text-primary-200 text-sm leading-relaxed mb-5 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 max-w-md">
                      {service.tagline}
                    </p>
                    <span className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl w-fit transition-colors">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
