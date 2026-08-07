import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { aboutConfig } from "@/lib/about-config";
import { Building2, MapPin, Smile, Star, ShieldCheck, HeartHandshake, Home, ArrowRight, MessageCircle } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Al-Arz Investments, our story, and our dedicated team.",
};

export default async function AboutPage() {
  // Fetch dynamic stats from database
  const [soldPropertiesCount, cities] = await Promise.all([
    prisma.property.count({ where: { status: "SOLD" } }),
    prisma.property.findMany({ select: { city: true }, distinct: ["city"] }),
  ]);

  const citiesCount = cities.length > 0 ? cities.length : 1; // Fallback if DB is empty

  // Fetch all active staff
  const staffMembers = await prisma.user.findMany({
    where: { role: "STAFF" },
    select: { id: true, name: true, phone: true, image: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative py-32 sm:py-48 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Corporate Real Estate Building"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary-900/80"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-white mb-8 backdrop-blur-md border border-white/20 p-2 shadow-2xl">
            <Image
              src="/logo.png"
              alt="Al-Arz Logo"
              width={64}
              height={64}
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Al-Arz Investments
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-primary-100 font-medium">
            {aboutConfig.hero.tagline}
          </p>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-primary-900/10 border border-neutral-100 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-16 flex flex-col justify-center">
              <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-4 block">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mb-6">{aboutConfig.story.title}</h2>
              <p className="text-lg text-primary-600 leading-relaxed">
                {aboutConfig.story.paragraph}
              </p>
            </div>
            <div className="relative h-64 sm:h-96 lg:h-auto hidden sm:block">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Business Deal Handshake"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Bar */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-accent-50 rounded-bl-full opacity-30 -z-0"></div>
        <div className="absolute bottom-0 left-0 p-24 bg-primary-50 rounded-tr-full opacity-50 -z-0"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
            <div className="flex flex-col items-center justify-center text-center group">
              <div className="h-16 w-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
                <Star className="h-8 w-8" />
              </div>
              <p className="text-4xl font-extrabold text-primary-900 mb-1 tracking-tight">
                <AnimatedCounter end={Number(aboutConfig.stats.yearsInBusiness)} suffix="+" />
              </p>
              <p className="text-sm font-bold text-primary-500 uppercase tracking-widest">Years in Business</p>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center group">
              <div className="h-16 w-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
                <Home className="h-8 w-8" />
              </div>
              <p className="text-4xl font-extrabold text-primary-900 mb-1 tracking-tight">
                <AnimatedCounter end={soldPropertiesCount} suffix="+" />
              </p>
              <p className="text-sm font-bold text-primary-500 uppercase tracking-widest">Properties Sold</p>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center group">
              <div className="h-16 w-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
                <Smile className="h-8 w-8" />
              </div>
              <p className="text-4xl font-extrabold text-primary-900 mb-1 tracking-tight">
                <AnimatedCounter end={Number(aboutConfig.stats.happyClients)} suffix="+" />
              </p>
              <p className="text-sm font-bold text-primary-500 uppercase tracking-widest">Happy Clients</p>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center group">
              <div className="h-16 w-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
                <MapPin className="h-8 w-8" />
              </div>
              <p className="text-4xl font-extrabold text-primary-900 mb-1 tracking-tight">
                <AnimatedCounter end={citiesCount} />
              </p>
              <p className="text-sm font-bold text-primary-500 uppercase tracking-widest">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us (Compact Grid) */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-4 block">
              Our Value
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">Why Choose Us</h2>
            <p className="mt-4 text-lg text-primary-600">The pillars that make Al-Arz Investments stand out in a competitive market.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl mx-auto">
            {aboutConfig.valueProps.map((prop, idx) => {
              const icons = [ShieldCheck, HeartHandshake, Home, Star];
              const images = [
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              ];
              const Icon = icons[idx % icons.length];
              const imageUrl = images[idx % images.length];
              
              return (
                <div key={idx} className="group flex flex-col gap-6">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src={imageUrl}
                      alt={prop.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-primary-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center text-accent-500 shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-bold text-primary-900">{prop.title}</h3>
                    </div>
                    <p className="text-primary-600 leading-relaxed text-lg">{prop.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. Team Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-4 block">
              Our People
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">Meet Our Team</h2>
            <p className="mt-4 text-lg text-primary-600">The dedicated professionals ready to assist you.</p>
          </div>

          {staffMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className="group flex flex-col items-center text-center p-4 hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Round Profile Photo — real image or initials fallback */}
                  <div className="relative h-32 w-32 rounded-full overflow-hidden bg-primary-700 border-4 border-primary-50 shadow-md mb-6 group-hover:border-accent-100 transition-colors flex items-center justify-center shrink-0">
                    {staff.image ? (
                      <Image
                        src={staff.image}
                        alt={staff.name || "Staff Member"}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <span className="text-3xl font-black text-white select-none">
                        {(staff.name || "?")
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((w: string) => w[0].toUpperCase())
                          .join("")}
                      </span>
                    )}
                  </div>

                  {/* Name & Title */}
                  <h3 className="text-xl font-bold text-primary-900 leading-tight">{staff.name}</h3>
                  <p className="text-xs font-semibold text-accent-500 uppercase tracking-widest mt-1 mb-4">Property Consultant</p>

                  {/* Animated Divider */}
                  <div className="w-8 h-0.5 bg-primary-200 rounded-full mb-6 group-hover:bg-accent-400 group-hover:w-16 transition-all duration-300" />

                  {/* WhatsApp Contact Button */}
                  <a
                    href={`https://wa.me/${(staff.phone || "923000000000").replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(staff.name || "")},%20I%20found%20your%20profile%20on%20the%20Al-Arz%20Real%20Estate%20website%20and%20would%20like%20to%20consult%20with%20you.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 text-white px-4 py-3 text-sm font-bold shadow-sm hover:bg-accent-600 hover:shadow-md transition-all"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact Agent
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-primary-500 py-16 bg-primary-50 rounded-3xl border border-primary-100">
              Our team profiles are currently being updated.
            </div>
          )}
        </div>
      </section>

      {/* 6. Our Office Gallery */}
      <section className="bg-primary-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Inside Al-Arz</h2>
            <p className="text-primary-300">Visit us at our headquarters in Islamabad.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ].map((url, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                <Image
                  src={url}
                  alt={`Office view ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-primary-50 rounded-[3rem] p-10 sm:p-20 relative overflow-hidden border border-primary-100 shadow-xl shadow-primary-900/5">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mb-8">Ready to find your dream property?</h2>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 rounded-2xl bg-accent-500 px-10 py-5 text-lg font-bold text-white shadow-lg shadow-accent-500/30 hover:bg-accent-600 hover:scale-105 transition-all"
              >
                Browse Properties
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
