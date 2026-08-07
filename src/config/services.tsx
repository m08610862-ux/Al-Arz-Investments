import { Key, MapPin, Building2, Briefcase, TrendingUp, ShieldCheck, HeartHandshake, FileCheck, Banknote, Search, ClipboardCheck, Handshake, Landmark, BarChart3, AlertTriangle, Home, Store, WrenchIcon, PaintBucket, Zap, MapPinned, LayoutGrid, ReceiptText } from "lucide-react";
import { PropertyCategory, PropertyLabel } from "@prisma/client";

export interface ServiceBullet {
  title: string;
  description: string;
}

export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceConfig {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  icon: React.ElementType;
  stats: ServiceStat[];
  bullets: ServiceBullet[];
  steps: ServiceStep[];
  propertyFilter: {
    categories?: PropertyCategory[];
    label?: PropertyLabel;
    orderBy?: "newest" | "label";
  };
}

export const services: ServiceConfig[] = [
  {
    slug: "houses-for-sale",
    name: "Houses for Sale/Purchase",
    tagline: "We bridge the gap between your dream home and reality.",
    description:
      "Whether you are looking for a modern apartment in Islamabad or a luxury villa in Rawalpindi, we provide end-to-end brokerage services so you never have to worry about a single detail.",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    icon: Key,
    stats: [
      { value: "500+", label: "Deals Closed" },
      { value: "100%", label: "Legally Verified" },
      { value: "FBR", label: "Tax Compliant" },
    ],
    bullets: [
      {
        title: "Legal Scrutiny",
        description:
          "Thorough verification of allotment letters, transfers, and ownership history (Fard/Intiqal).",
      },
      {
        title: "Complete Paperwork",
        description:
          "Hassle-free handling of CDA/RDA/Society transfer procedures.",
      },
      {
        title: "Financial Compliance",
        description:
          "Expert guidance on FBR and DC tax documentation to ensure a transparent transaction.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Free Consultation",
        description: "Tell us your budget, preferred location, and requirements. Our agents will guide you from day one.",
      },
      {
        step: 2,
        title: "Property Shortlisting",
        description: "We handpick verified properties that match your needs and arrange convenient viewings.",
      },
      {
        step: 3,
        title: "Legal Verification",
        description: "Our team conducts full legal scrutiny — Fard, ownership history, NOCs — before you commit.",
      },
      {
        step: 4,
        title: "Transfer & Closing",
        description: "We handle all paperwork, CDA/RDA/Society transfers, and FBR compliance for a smooth handover.",
      },
    ],
    propertyFilter: {
      categories: ["HOUSE", "APARTMENT", "FARMHOUSE"],
    },
  },
  {
    slug: "residential-commercial-plots",
    name: "Residential & Commercial Plots",
    tagline: "Secure your future with the right piece of land.",
    description:
      "We specialize in identifying high-growth plots in prestigious societies like DHA, Bahria Town, and Gulberg — helping you invest in land that appreciates.",
    heroImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    icon: MapPin,
    stats: [
      { value: "1,000+", label: "Plots Sold" },
      { value: "DHA / BT", label: "Premium Societies" },
      { value: "File & Possession", label: "Both Available" },
    ],
    bullets: [
      {
        title: "Portfolio Variety",
        description:
          "Options ranging from 5 Marla and 10 Marla to 1 Kanal+ residential plots.",
      },
      {
        title: "Strategic Commercial Plots",
        description:
          "Prime locations for high-rise buildings and retail shops.",
      },
      {
        title: "Verification Services",
        description:
          'Assisting with site visits, map approvals, and "File vs. Possession" status analysis.',
      },
    ],
    steps: [
      {
        step: 1,
        title: "Requirement Analysis",
        description: "We understand your investment goals — plot size, society preference, and budget.",
      },
      {
        step: 2,
        title: "Site Visits & Shortlisting",
        description: "We arrange visits to shortlisted plots and verify their physical possession status.",
      },
      {
        step: 3,
        title: "Map & NOC Approvals",
        description: "Our team assists with society map checks, approval status, and legal clearances.",
      },
      {
        step: 4,
        title: "Investment Secured",
        description: "We handle the full transfer process so your investment is registered in your name safely.",
      },
    ],
    propertyFilter: {
      categories: ["PLOT"],
    },
  },
  {
    slug: "commercial-properties",
    name: "Commercial Properties",
    tagline: "Elevate your business presence with prime commercial real estate.",
    description:
      "We help entrepreneurs and corporations find the perfect space to thrive — from modern offices in Islamabad's Blue Area to high-footfall retail outlets in Rawalpindi's commercial hubs.",
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    icon: Building2,
    stats: [
      { value: "Blue Area", label: "Prime Locations" },
      { value: "Office & Retail", label: "All Types" },
      { value: "Long-term", label: "Lease Management" },
    ],
    bullets: [
      {
        title: "Corporate Spaces",
        description:
          "Modern office layouts in Islamabad's Blue Area and Rawalpindi's commercial hubs.",
      },
      {
        title: "Retail Success",
        description:
          "Shop and showroom spaces designed for maximum footfall and visibility.",
      },
      {
        title: "Rental Management",
        description:
          "Expert negotiation for long-term lease agreements and rental yield optimization.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Business Needs Assessment",
        description: "We understand your business type, team size, and location priorities to find the perfect fit.",
      },
      {
        step: 2,
        title: "Location Shortlisting",
        description: "We present verified commercial spaces with footfall data and lease terms for comparison.",
      },
      {
        step: 3,
        title: "Negotiation",
        description: "Our agents negotiate the best price, lease terms, and fit-out allowances on your behalf.",
      },
      {
        step: 4,
        title: "Handover & Support",
        description: "We manage the legal handover and remain available for any post-acquisition support.",
      },
    ],
    propertyFilter: {
      categories: ["COMMERCIAL"],
    },
  },
  {
    slug: "construction-maintenance",
    name: "Construction & Maintenance",
    tagline: "From the first brick to the final coat of paint.",
    description:
      "Our construction wing focuses on quality, durability, and modern aesthetics. We build structures that stand the test of time — from grey structures to fully furnished luxury homes.",
    heroImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    icon: Briefcase,
    stats: [
      { value: "A+ Category", label: "Grey Structures" },
      { value: "Turnkey", label: "Solutions" },
      { value: "Certified", label: "Professionals" },
    ],
    bullets: [
      {
        title: "Turnkey Solutions",
        description:
          '"A+ Category" construction for grey structures and luxury finishes.',
      },
      {
        title: "Renovation & Upgrades",
        description:
          "Modernizing older properties to increase market value.",
      },
      {
        title: "Reliable Maintenance",
        description:
          "Ongoing electrical, plumbing, and structural upkeep provided by skilled professionals.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Design & Planning",
        description: "We collaborate with architects and engineers to create a detailed construction plan within your budget.",
      },
      {
        step: 2,
        title: "Grey Structure",
        description: "A+ Category construction of the foundation, columns, slabs, and brickwork to the highest standards.",
      },
      {
        step: 3,
        title: "Finishing & Interiors",
        description: "Premium tiling, plastering, electrical, plumbing, and luxury finishes are applied with care.",
      },
      {
        step: 4,
        title: "Handover & Maintenance",
        description: "We hand over the completed project and offer ongoing maintenance packages for peace of mind.",
      },
    ],
    propertyFilter: {
      categories: ["HOUSE", "APARTMENT", "COMMERCIAL", "PLOT", "FARMHOUSE"],
      orderBy: "newest",
    },
  },
  {
    slug: "investments-consultancy",
    name: "Investments Consultancy",
    tagline: "Make your money work for you.",
    description:
      "In a fluctuating market, we provide data-driven advice to ensure your capital is parked in the most profitable avenues — from upcoming housing societies to secure, legally approved projects.",
    heroImage:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    icon: TrendingUp,
    stats: [
      { value: "Data-Driven", label: "Market Analysis" },
      { value: "Legal", label: "Approved Projects Only" },
      { value: "Short & Long", label: "Term ROI Strategies" },
    ],
    bullets: [
      {
        title: "Market Insight",
        description:
          'Deep-dive analysis of upcoming housing societies and investment "hotspots."',
      },
      {
        title: "Risk Mitigation",
        description:
          "Helping you avoid unapproved schemes and securing investments in legal, approved projects.",
      },
      {
        title: "ROI Projections",
        description:
          "Short-term and long-term capital gain strategies tailored to your budget.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Portfolio Assessment",
        description: "We review your current assets, risk appetite, and investment timeline to build a tailored strategy.",
      },
      {
        step: 2,
        title: "Market Analysis",
        description: "Our analysts identify high-growth zones, upcoming projects, and undervalued opportunities.",
      },
      {
        step: 3,
        title: "Investment Plan",
        description: "We present a clear investment roadmap with projected returns and risk analysis for each option.",
      },
      {
        step: 4,
        title: "Ongoing Support",
        description: "We stay by your side — tracking market movements and advising on the best exit or hold strategy.",
      },
    ],
    propertyFilter: {
      label: "HOT",
      orderBy: "label",
    },
  },
];

export function getService(slug: string): ServiceConfig | undefined {
  return services.find((s) => s.slug === slug);
}
