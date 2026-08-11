import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { ContactForm } from "@/components/contact/contact-form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getSiteSettings } from "@/app/actions/settings";

export const metadata: Metadata = {
  title: "Contact Us | Al-Arz Investments",
  description: "Get in touch with Al-Arz Investments for all your property needs in Pakistan.",
};

export default async function ContactPage() {
  // Fetch staff members to populate the dropdown and featured cards
  const staff = await prisma.user.findMany({
    where: { role: "STAFF" },
    select: { id: true, name: true, phone: true },
    orderBy: { createdAt: "asc" },
  });

  const siteSettings = await getSiteSettings();

  // Pick first 2 staff members as "featured"
  const featuredStaff = staff.slice(0, 2);

  return (
    <main className="min-h-screen pb-20">
      {/* Professional Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-primary-900 mb-12">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Al-Arz Office"
          fill
          className="object-cover opacity-60 object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mt-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-primary-200 max-w-2xl mx-auto font-medium">
            Have a question about a property, or looking to sell? Our team of experts is here to help you every step of the way.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        
        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Location */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-primary-900/5 border border-primary-100 flex flex-col items-center text-center group hover:border-accent-200 transition-all duration-300">
            <div className="h-16 w-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">Our Office</h3>
            <p className="text-primary-600 leading-relaxed font-medium">
              {siteSettings?.address}<br/>{siteSettings?.city}
            </p>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-primary-900/5 border border-primary-100 flex flex-col items-center text-center group hover:border-accent-200 transition-all duration-300">
            <div className="h-16 w-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">Call Us</h3>
            <p className="text-primary-600 leading-relaxed font-medium">
              {siteSettings?.phone}<br/>{siteSettings?.phone2}
            </p>
          </div>

          {/* Email & Hours */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-primary-900/5 border border-primary-100 flex flex-col items-center text-center group hover:border-accent-200 transition-all duration-300">
            <div className="h-16 w-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">Email Us</h3>
            <p className="text-primary-600 leading-relaxed font-medium">
              {siteSettings?.email}<br/>{siteSettings?.email2}
            </p>
          </div>
        </div>

        {/* Form and Map Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-primary-900/5 border border-primary-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Column: Contact Form */}
          <div className="flex-1 p-8 sm:p-12 lg:pr-16 relative">
            <div className="absolute top-0 left-0 p-32 bg-accent-50 rounded-br-full opacity-30 -z-0"></div>
            <div className="relative z-10">
              <div className="mb-10">
                <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-3 block">
                  Send a Message
                </span>
                <h2 className="text-3xl font-bold text-primary-900 tracking-tight">
                  How can we help you?
                </h2>
                <p className="mt-3 text-primary-500">
                  Fill out the form below and one of our dedicated agents will get back to you immediately.
                </p>
              </div>
              
              <ContactForm />
            </div>
          </div>

          {/* Right Column: Interactive Map & Hours */}
          <div className="w-full lg:w-[45%] bg-primary-50 relative flex flex-col border-t lg:border-t-0 lg:border-l border-primary-100">
            {/* Map */}
            <div className="flex-1 relative min-h-[400px]">
              <iframe 
                src="https://maps.google.com/maps?q=33.5260278,73.1559722&hl=en&z=16&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
                className="absolute inset-0 grayscale contrast-125 hover:grayscale-0 transition-all duration-700 object-cover"
              />
            </div>
            
            {/* Business Hours Strip */}
            <div className="bg-primary-900 p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-800 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent-400" />
                </div>
                <div>
                  <p className="text-xs text-primary-300 font-bold uppercase tracking-wider mb-1">Business Hours</p>
                  <p className="font-medium text-sm">{siteSettings?.businessHours}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-primary-800"></div>
              <div>
                <p className="text-xs text-primary-300 font-bold uppercase tracking-wider mb-1">Weekend</p>
                <p className="font-medium text-sm">{siteSettings?.businessHoursWeekend}</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
