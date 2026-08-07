import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { 
  Building2, ArrowRight, Shield, Users, TrendingUp, 
  Star, HeartHandshake, MessageCircle, Briefcase, MapPin, Key, UserCheck
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { HeroSearch } from "@/components/home/hero-search";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { TestimonialsSlider } from "@/components/home/testimonials-slider";

export default async function Home() {
  // 1. Fetch Dynamic Data

  // Top 4 Staff Members
  const staffMembers = await prisma.user.findMany({
    where: { role: "STAFF" },
    select: { id: true, name: true, phone: true, image: true },
    orderBy: { createdAt: "asc" },
    take: 4,
  });

  const testimonials = [
    {
      id: "1",
      name: "Ahmed Raza",
      role: "First-time Buyer",
      quote: "Al-Arz made buying our first home incredibly easy. Their transparency and dedication are unmatched in the market.",
      image: null,
      rating: 5,
    },
    {
      id: "2",
      name: "Sarah Khan",
      role: "Property Investor",
      quote: "The market insights provided by the Al-Arz team helped me secure a highly profitable commercial plot in Islamabad.",
      image: null,
      rating: 5,
    },
    {
      id: "3",
      name: "Usman Ali",
      role: "Homeowner",
      quote: "From viewing to closing, they handled everything professionally. I highly recommend them to anyone looking to buy or sell.",
      image: null,
      rating: 5,
    },
    {
      id: "4",
      name: "Fatima Noor",
      role: "Business Owner",
      quote: "Renting a commercial space through them was a breeze. Highly professional and responsive team.",
      image: null,
      rating: 5,
    },
  ];

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[620px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Home Exterior"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          {/* Multi-layer gradient for cinematic depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/80 to-primary-800/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent" />
        </div>

        {/* Glowing accent orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent-500/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-500/15 border border-accent-400/25 backdrop-blur-sm px-5 py-2 text-xs font-bold text-accent-300 uppercase tracking-widest mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
            <Building2 className="h-3.5 w-3.5" />
            Pakistan&apos;s Premium Real Estate Partner
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-[0.9] mb-6">
            Find Your<br />
            <span className="text-accent-400">Dream Home</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-4 text-lg sm:text-xl text-primary-300 leading-relaxed max-w-2xl font-medium">
            Discover premium properties across Pakistan — from luxurious homes
            to high-yield investments. Let Al-Arz Investments guide you home.
          </p>

          {/* Search Bar */}
          <div className="mt-12 w-full max-w-4xl mx-auto">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROPERTIES (Server Component) */}
      <FeaturedProperties />

      {/* 3. WHY CHOOSE US */}
      <section className="py-24 bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-4 block">
                Why choose us
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-primary-900 tracking-tight leading-[1.15] mb-6">
                Experience the Difference with Premium Real Estate Services
              </h2>
              <p className="text-lg text-primary-600 leading-relaxed">
                Discover the perfect blend of expertise and dedication in every property we handle. Our tailored real estate services ensure exceptional results, perfectly aligned with your vision.
              </p>
            </div>

            {/* Right Grid (Clover design) */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-primary-100/50 rounded-3xl overflow-hidden shadow-lg border border-primary-100">
              {/* Top Left */}
              <div className="bg-primary-50 p-8 sm:p-10 flex flex-col items-center text-center rounded-br-[4rem] transition-colors hover:bg-primary-100">
                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-accent-500 mb-6">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-3">Trusted & Verified</h3>
                <p className="text-primary-600 text-sm leading-relaxed">Every property listing is verified by our expert team. We ensure complete transparency.</p>
              </div>

              {/* Top Right */}
              <div className="bg-white p-8 sm:p-10 flex flex-col items-center text-center rounded-bl-[4rem] transition-colors hover:bg-primary-50">
                <div className="h-14 w-14 bg-primary-50 rounded-2xl flex items-center justify-center shadow-sm text-accent-500 mb-6 border border-primary-100">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-3">Expert Team</h3>
                <p className="text-primary-600 text-sm leading-relaxed">Our experienced professionals provide personalized guidance for your investments.</p>
              </div>

              {/* Bottom Left */}
              <div className="bg-white p-8 sm:p-10 flex flex-col items-center text-center rounded-tr-[4rem] transition-colors hover:bg-primary-50">
                <div className="h-14 w-14 bg-primary-50 rounded-2xl flex items-center justify-center shadow-sm text-accent-500 mb-6 border border-primary-100">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-3">Market Insights</h3>
                <p className="text-primary-600 text-sm leading-relaxed">Get access to real-time market data to make informed decisions with confidence.</p>
              </div>

              {/* Bottom Right */}
              <div className="bg-primary-50 p-8 sm:p-10 flex flex-col items-center text-center rounded-tl-[4rem] transition-colors hover:bg-primary-100">
                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-accent-500 mb-6">
                  <HeartHandshake className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-3">Client Satisfaction</h3>
                <p className="text-primary-600 text-sm leading-relaxed">Commitment to quality, timeliness, and exceeding our clients' expectations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR SERVICES (Image Grid with Overlay) */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-4 block">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-primary-600 max-w-2xl mx-auto">
              Comprehensive real estate solutions tailored for every need — from buying your first home to growing your investment portfolio.
            </p>
          </div>

          {/* Grid: top row 2 col, middle row 2 col, bottom row 1 col full-width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* 1. Houses for Sale/Purchase */}
            <div className="group relative overflow-hidden rounded-3xl min-h-[340px]">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Houses for Sale/Purchase"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-primary-900/20 group-hover:from-primary-900/95 transition-all duration-500" />
              <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 border border-white/20">
                  <Key className="h-6 w-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Houses for Sale/Purchase</h3>
                <p className="text-primary-200 text-sm leading-relaxed mb-6 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
                  We bridge the gap between your dream home and reality, with end-to-end brokerage services including legal scrutiny, paperwork, and financial compliance.
                </p>
                <Link href="/services/houses-for-sale" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl w-fit transition-colors">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 2. Residential and Commercial Plots */}
            <div className="group relative overflow-hidden rounded-3xl min-h-[340px]">
              <Image
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Residential and Commercial Plots"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-primary-900/20 group-hover:from-primary-900/95 transition-all duration-500" />
              <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 border border-white/20">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Residential &amp; Commercial Plots</h3>
                <p className="text-primary-200 text-sm leading-relaxed mb-6 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
                  Secure your future with the right piece of land. We specialize in high-growth plots in DHA, Bahria Town, and Gulberg.
                </p>
                <Link href="/services/residential-commercial-plots" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl w-fit transition-colors">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 3. Commercial Properties */}
            <div className="group relative overflow-hidden rounded-3xl min-h-[340px]">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Commercial Properties"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-primary-900/20 group-hover:from-primary-900/95 transition-all duration-500" />
              <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 border border-white/20">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Commercial Properties</h3>
                <p className="text-primary-200 text-sm leading-relaxed mb-6 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
                  Elevate your business presence with prime commercial real estate — from corporate offices in Blue Area to retail showrooms with maximum footfall.
                </p>
                <Link href="/services/commercial-properties" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl w-fit transition-colors">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 4. Construction and Maintenance */}
            <div className="group relative overflow-hidden rounded-3xl min-h-[340px]">
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Construction and Maintenance"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-primary-900/20 group-hover:from-primary-900/95 transition-all duration-500" />
              <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 border border-white/20">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Construction &amp; Maintenance</h3>
                <p className="text-primary-200 text-sm leading-relaxed mb-6 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
                  From the first brick to the final coat of paint. Turnkey grey structures, luxury finishes, and reliable ongoing maintenance by skilled professionals.
                </p>
                <Link href="/services/construction-maintenance" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl w-fit transition-colors">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 5. Investments Consultancy — Full Width */}
            <div className="group relative overflow-hidden rounded-3xl min-h-[340px] md:col-span-2">
              <Image
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                alt="Investments Consultancy"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/70 to-primary-900/30 group-hover:from-primary-900/98 transition-all duration-500" />
              <div className="absolute inset-0 p-8 sm:p-14 flex flex-col justify-center max-w-2xl">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 border border-white/20">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">Investments Consultancy</h3>
                <p className="text-primary-200 leading-relaxed mb-6">
                  Make your money work for you. We provide data-driven advice — market hotspot analysis, risk mitigation against unapproved schemes, and ROI projections tailored to your budget.
                </p>
                <Link href="/services/investments-consultancy" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold px-6 py-3 rounded-xl w-fit transition-colors">
                  Get Consultation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-4 block">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-primary-500 max-w-xl mx-auto">
              Don&apos;t just take our word for it — hear from the families and investors we&apos;ve helped.
            </p>
          </div>

          <TestimonialsSlider testimonials={testimonials} />

        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-white py-24 relative overflow-hidden border-b border-primary-100">
            <div className="absolute top-0 right-0 p-32 bg-accent-50 rounded-bl-full opacity-30 -z-0"></div>
            <div className="absolute bottom-0 left-0 p-24 bg-primary-50 rounded-tr-full opacity-50 -z-0"></div>
            
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
                <div className="flex flex-col items-center justify-center text-center group">
                  <div className="h-16 w-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <p className="text-4xl font-extrabold text-primary-900 mb-1 tracking-tight">
                    <AnimatedCounter end={500} suffix="+" />
                  </p>
                  <p className="text-sm font-bold text-primary-500 uppercase tracking-widest">Properties Sold</p>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center group">
                  <div className="h-16 w-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <p className="text-4xl font-extrabold text-primary-900 mb-1 tracking-tight">
                    <AnimatedCounter end={10} suffix="+" />
                  </p>
                  <p className="text-sm font-bold text-primary-500 uppercase tracking-widest">Years Experience</p>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center group">
                  <div className="h-16 w-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
                    <Users className="h-8 w-8" />
                  </div>
                  <p className="text-4xl font-extrabold text-primary-900 mb-1 tracking-tight">
                    <AnimatedCounter end={10000} suffix="+" />
                  </p>
                  <p className="text-sm font-bold text-primary-500 uppercase tracking-widest">Happy Clients</p>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center group">
                  <div className="h-16 w-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-primary-100">
                    <Shield className="h-8 w-8" />
                  </div>
                  <p className="text-4xl font-extrabold text-primary-900 mb-1 tracking-tight">
                    <AnimatedCounter end={100} suffix="%" />
                  </p>
                  <p className="text-sm font-bold text-primary-500 uppercase tracking-widest">Secure</p>
                </div>
              </div>
            </div>
          </section>

      {/* 6. MEET OUR AGENTS STRIP */}
      {staffMembers.length > 0 && (
        <section className="py-24 bg-primary-50 border-t border-primary-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-accent-500 font-bold tracking-wider uppercase text-sm mb-3 block">
                  Our People
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight">
                  Meet Our Experts
                </h2>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-accent-600 transition-colors"
              >
                View full team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {staffMembers.map((staff) => (
                <Link
                  key={staff.id}
                  href="/about"
                  className="group flex flex-col items-center text-center p-4 hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Round Profile Photo — real image or initials fallback */}
                  <div className="relative h-28 w-28 rounded-full overflow-hidden bg-primary-700 border-4 border-primary-50 shadow-md mb-5 group-hover:border-accent-100 transition-colors flex items-center justify-center shrink-0">
                    {staff.image ? (
                      <Image
                        src={staff.image}
                        alt={staff.name || "Staff Member"}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    ) : (
                      <span className="text-2xl font-black text-white select-none">
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
                  <h3 className="text-lg font-bold text-primary-900 leading-tight">{staff.name}</h3>
                  <p className="text-xs font-semibold text-accent-500 uppercase tracking-widest mt-1 mb-4">Property Consultant</p>

                  {/* Divider */}
                  <div className="w-8 h-0.5 bg-primary-200 rounded-full mb-4 group-hover:bg-accent-400 group-hover:w-12 transition-all duration-300" />

                  {/* View Profile */}
                  <span className="text-sm font-semibold text-primary-500 group-hover:text-accent-500 transition-colors">
                    View Profile →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. CTA SECTION */}
      <section className="relative py-24 sm:py-32 overflow-hidden flex items-center justify-center min-h-[500px]">
        {/* Background Image behind the whole section */}
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Luxury property background"
          fill
          className="object-cover object-center"
        />
        {/* Dark overlay over the entire section background */}
        <div className="absolute inset-0 bg-primary-900/85" />
        
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[3rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-center px-8 py-16 sm:py-20 sm:px-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-lg text-primary-200 max-w-2xl mx-auto mb-10">
              Browse our complete catalog of premium listings or get in touch with an agent to start your journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/properties"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-accent-500/20 hover:bg-accent-600 transition-all hover:scale-105"
              >
                Browse Listings
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-8 py-4 text-sm font-bold text-white border border-white/20 shadow-sm hover:bg-white/20 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
