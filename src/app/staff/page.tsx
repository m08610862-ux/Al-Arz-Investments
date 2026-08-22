import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  Building2,
  Users,
  FileSpreadsheet,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  PhoneCall,
  CheckCircle2,
  Layers,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function StaffDashboard() {
  const session = await requireAuth();
  const staffId = session.user.id;

  // All queries are scoped to THIS staff member only
  const [
    myPropertyCount,
    myLeadCount,
    myInventoryCount,
    myPropertiesByStatus,
    myLeadsByStatus,
    recentLeads,
    recentProperties,
  ] = await Promise.all([
    prisma.property.count({
      where: { OR: [{ createdById: staffId }, { assignedToId: staffId }] },
    }),
    prisma.client.count({
      where: { assignedStaffId: staffId },
    }),
    prisma.staffInventory.count({
      where: { createdById: staffId },
    }),
    prisma.property.groupBy({
      by: ["status"],
      where: { OR: [{ createdById: staffId }, { assignedToId: staffId }] },
      _count: true,
    }),
    prisma.client.groupBy({
      by: ["status"],
      where: { assignedStaffId: staffId },
      _count: true,
    }),
    prisma.client.findMany({
      where: { assignedStaffId: staffId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        createdAt: true,
        property: { select: { title: true } },
      },
    }),
    prisma.property.findMany({
      where: { OR: [{ createdById: staffId }, { assignedToId: staffId }] },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        city: true,
        society: true,
        phase: true,
        images: true,
      },
    }),
  ]);

  const getPropCount = (status: string) =>
    myPropertiesByStatus.find((p) => p.status === status)?._count ?? 0;

  const getLeadCount = (status: string) =>
    myLeadsByStatus.find((l) => l.status === status)?._count ?? 0;

  const availableCount = getPropCount("AVAILABLE");
  const soldCount = getPropCount("SOLD");
  const rentedCount = getPropCount("RENTED");
  const reservedCount = getPropCount("RESERVED");

  const newLeads = getLeadCount("NEW");
  const contactedLeads = getLeadCount("CONTACTED");
  const negotiatingLeads = getLeadCount("NEGOTIATING");
  const closedLeads = getLeadCount("CLOSED");
  const lostLeads = getLeadCount("LOST");

  const leadPipelineStages = [
    { label: "New Inquiries", count: newLeads, code: "NEW" },
    { label: "Contacted", count: contactedLeads, code: "CONTACTED" },
    { label: "Negotiating", count: negotiatingLeads, code: "NEGOTIATING" },
    { label: "Closed / Won", count: closedLeads, code: "CLOSED" },
    { label: "Closed / Lost", count: lostLeads, code: "LOST" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* ── Welcome Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent-500">
              Staff Agent Portal
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary-900 tracking-tight mt-1">
            Welcome back, {session.user.name}
          </h1>
          <p className="text-xs text-primary-500 mt-0.5">
            Here is your live summary of assigned properties, client inquiries, and private inventory.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/staff/inventory"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl border border-primary-200 transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-accent-500" />
            <span>Inventory Sheet</span>
          </Link>
          <Link
            href="/staff/clients"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl border border-primary-200 transition-colors"
          >
            <Users className="h-3.5 w-3.5 text-accent-500" />
            <span>My Leads</span>
          </Link>
          <Link
            href="/staff/properties"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-accent-500 hover:bg-accent-600 rounded-xl transition-colors shadow-sm"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>My Properties</span>
          </Link>
        </div>
      </div>

      {/* ── Key Performance Metric Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* My Properties */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-accent-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">
              My Active Listings
            </span>
            <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center border border-accent-100">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-primary-900">{myPropertyCount}</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-primary-500 font-medium">
              <span className="text-accent-500 font-bold">{availableCount} Available</span>
              <span>•</span>
              <span>{soldCount} Sold</span>
            </div>
          </div>
          <Link
            href="/staff/properties"
            className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-accent-500 hover:text-accent-600 transition-colors"
          >
            <span>Manage Properties</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* My Inventory */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-accent-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">
              My Inventory Sheet
            </span>
            <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center border border-accent-100">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-primary-900">{myInventoryCount}</div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-primary-500 font-medium">
              <span>Personal records in spreadsheet</span>
            </div>
          </div>
          <Link
            href="/staff/inventory"
            className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-accent-500 hover:text-accent-600 transition-colors"
          >
            <span>Open Inventory Sheet</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Assigned Leads */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-accent-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">
              Assigned Leads
            </span>
            <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center border border-accent-100">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-primary-900">{myLeadCount}</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-primary-500 font-medium">
              <span className="text-accent-500 font-bold">{newLeads} New Inquiries</span>
              <span>•</span>
              <span>{closedLeads} Closed</span>
            </div>
          </div>
          <Link
            href="/staff/clients"
            className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-accent-500 hover:text-accent-600 transition-colors"
          >
            <span>View My Pipeline</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Closed Deals */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-accent-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">
              Closed Won Deals
            </span>
            <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center border border-accent-100">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-primary-900">{closedLeads}</div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-primary-500 font-medium">
              <span>Successfully finalized clients</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-primary-400">
            <span>Sales Performance</span>
            <TrendingUp className="h-3.5 w-3.5 text-accent-500" />
          </div>
        </div>
      </div>

      {/* ── Status Breakdown & Pipeline ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listings by Status */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent-500" />
              <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
                My Property Status Distribution
              </h2>
            </div>
            <span className="text-xs font-bold text-primary-500">
              {myPropertyCount} Total
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Available */}
            <div>
              <div className="flex justify-between text-xs font-bold text-primary-800 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-500" />
                  Available For Sale / Rent
                </span>
                <span>
                  {availableCount}{" "}
                  <span className="text-primary-400 font-normal">
                    ({myPropertyCount > 0 ? Math.round((availableCount / myPropertyCount) * 100) : 0}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-500 rounded-full transition-all"
                  style={{ width: `${myPropertyCount > 0 ? (availableCount / myPropertyCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Sold */}
            <div>
              <div className="flex justify-between text-xs font-bold text-primary-800 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary-700" />
                  Sold
                </span>
                <span>
                  {soldCount}{" "}
                  <span className="text-primary-400 font-normal">
                    ({myPropertyCount > 0 ? Math.round((soldCount / myPropertyCount) * 100) : 0}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-700 rounded-full transition-all"
                  style={{ width: `${myPropertyCount > 0 ? (soldCount / myPropertyCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Rented */}
            <div>
              <div className="flex justify-between text-xs font-bold text-primary-800 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-300" />
                  Rented
                </span>
                <span>
                  {rentedCount}{" "}
                  <span className="text-primary-400 font-normal">
                    ({myPropertyCount > 0 ? Math.round((rentedCount / myPropertyCount) * 100) : 0}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-300 rounded-full transition-all"
                  style={{ width: `${myPropertyCount > 0 ? (rentedCount / myPropertyCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Reserved */}
            <div>
              <div className="flex justify-between text-xs font-bold text-primary-800 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary-400" />
                  Reserved
                </span>
                <span>
                  {reservedCount}{" "}
                  <span className="text-primary-400 font-normal">
                    ({myPropertyCount > 0 ? Math.round((reservedCount / myPropertyCount) * 100) : 0}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-400 rounded-full transition-all"
                  style={{ width: `${myPropertyCount > 0 ? (reservedCount / myPropertyCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Pipeline Stages */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent-500" />
              <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
                My Client Pipeline
              </h2>
            </div>
            <Link
              href="/staff/clients"
              className="text-xs font-bold text-accent-500 hover:text-accent-600 transition-colors"
            >
              Open Pipeline →
            </Link>
          </div>

          <div className="mt-5 space-y-2.5">
            {leadPipelineStages.map((stage) => {
              const pct = myLeadCount > 0 ? Math.round((stage.count / myLeadCount) * 100) : 0;
              return (
                <div
                  key={stage.code}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-accent-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary-900">
                      {stage.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-primary-400 font-medium">{pct}%</span>
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-lg text-xs font-extrabold bg-white border border-neutral-200 text-primary-900">
                      {stage.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Activity Grids ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
                My Recent Listings
              </h2>
              <Link
                href="/staff/properties"
                className="text-xs font-bold text-accent-500 hover:text-accent-600"
              >
                All ({myPropertyCount})
              </Link>
            </div>

            <div className="mt-4 divide-y divide-neutral-100">
              {recentProperties.length === 0 ? (
                <p className="text-xs text-primary-400 py-6 text-center">No properties added yet.</p>
              ) : (
                recentProperties.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-11 w-14 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                        {p.images?.[0] ? (
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-primary-300 text-[9px]">
                            No photo
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-primary-900 truncate">{p.title}</p>
                        <p className="text-[11px] text-primary-500 truncate">
                          {[p.city, p.society, p.phase].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-primary-900">
                        Rs {p.price.toLocaleString("en-PK")}
                      </p>
                      <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-50 text-accent-600 border border-accent-100">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/staff/properties"
            className="mt-4 pt-3 border-t border-neutral-100 text-center text-xs font-bold text-primary-700 hover:text-accent-500 transition-colors block"
          >
            Manage My Properties →
          </Link>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
                My Recent Leads
              </h2>
              <Link
                href="/staff/clients"
                className="text-xs font-bold text-accent-500 hover:text-accent-600"
              >
                All ({myLeadCount})
              </Link>
            </div>

            <div className="mt-4 divide-y divide-neutral-100">
              {recentLeads.length === 0 ? (
                <p className="text-xs text-primary-400 py-6 text-center">No assigned inquiries yet.</p>
              ) : (
                recentLeads.map((lead) => (
                  <div key={lead.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-primary-900 truncate">{lead.name}</p>
                        <span className="text-[10px] font-mono text-primary-400">
                          {lead.phone}
                        </span>
                      </div>
                      <p className="text-[11px] text-primary-500 truncate mt-0.5">
                        {lead.property?.title ? `Interest: ${lead.property.title}` : "General Inquiry"}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 border border-primary-200">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/staff/clients"
            className="mt-4 pt-3 border-t border-neutral-100 text-center text-xs font-bold text-primary-700 hover:text-accent-500 transition-colors block"
          >
            Open My Client Leads →
          </Link>
        </div>
      </div>
    </div>
  );
}
