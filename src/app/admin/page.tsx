import prisma from "@/lib/prisma";
import {
  Building2,
  Users,
  FileSpreadsheet,
  Plus,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  PhoneCall,
  Calendar,
  Layers,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch global metrics concurrently
  const [
    totalProperties,
    totalLeads,
    totalStaff,
    totalInventory,
    propertiesByStatus,
    leadsByStatus,
    recentProperties,
    recentLeads,
    staffMembers,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.client.count(),
    prisma.user.count({ where: { role: "STAFF" } }),
    prisma.staffInventory.count(),
    prisma.property.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.client.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        createdBy: { select: { name: true } },
      },
    }),
    prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: { select: { title: true } },
        assignedStaff: { select: { name: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "STAFF" },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        _count: {
          select: {
            createdProperties: true,
            assignedClients: true,
          },
        },
      },
    }),
  ]);

  // Helper counters
  const getPropStatusCount = (status: string) =>
    propertiesByStatus.find((p) => p.status === status)?._count ?? 0;

  const getLeadStatusCount = (status: string) =>
    leadsByStatus.find((l) => l.status === status)?._count ?? 0;

  const availableCount = getPropStatusCount("AVAILABLE");
  const soldCount = getPropStatusCount("SOLD");
  const rentedCount = getPropStatusCount("RENTED");
  const reservedCount = getPropStatusCount("RESERVED");

  const newLeads = getLeadStatusCount("NEW");
  const contactedLeads = getLeadStatusCount("CONTACTED");
  const negotiatingLeads = getLeadStatusCount("NEGOTIATING");
  const closedLeads = getLeadStatusCount("CLOSED");
  const lostLeads = getLeadStatusCount("LOST");

  const leadPipelineStages = [
    { label: "New Inquiries", count: newLeads, code: "NEW" },
    { label: "Contacted", count: contactedLeads, code: "CONTACTED" },
    { label: "Negotiating", count: negotiatingLeads, code: "NEGOTIATING" },
    { label: "Closed / Won", count: closedLeads, code: "CLOSED" },
    { label: "Closed / Lost", count: lostLeads, code: "LOST" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* ── Executive Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent-500">
              Executive Management
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary-900 tracking-tight mt-1">
            Admin Overview Dashboard
          </h1>
          <p className="text-xs text-primary-500 mt-0.5">
            Comprehensive real-time analytics across property listings, leads pipeline, and staff operations.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl border border-primary-200 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5 text-accent-500" />
            <span>Manage Properties</span>
          </Link>
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl border border-primary-200 transition-colors"
          >
            <Users className="h-3.5 w-3.5 text-accent-500" />
            <span>Client Inquiries</span>
          </Link>
          <Link
            href="/admin/staff"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-accent-500 hover:bg-accent-600 rounded-xl transition-colors shadow-sm"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Staff Operations</span>
          </Link>
        </div>
      </div>

      {/* ── Key Performance Metric Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Properties */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-accent-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">
              Properties Listed
            </span>
            <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center border border-accent-100">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-primary-900">{totalProperties}</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-primary-500 font-medium">
              <span className="text-accent-500 font-bold">{availableCount} Available</span>
              <span>•</span>
              <span>{soldCount} Sold</span>
            </div>
          </div>
          <Link
            href="/admin/properties"
            className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-accent-500 hover:text-accent-600 transition-colors"
          >
            <span>View All Listings</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Total Leads / Inquiries */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-accent-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center border border-accent-100">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-primary-900">{totalLeads}</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-primary-500 font-medium">
              <span className="text-accent-500 font-bold">{newLeads} New Inquiries</span>
              <span>•</span>
              <span>{closedLeads} Won</span>
            </div>
          </div>
          <Link
            href="/admin/clients"
            className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-accent-500 hover:text-accent-600 transition-colors"
          >
            <span>View Leads Pipeline</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Active Staff */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-accent-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">
              Active Agents / Staff
            </span>
            <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center border border-accent-100">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-primary-900">{totalStaff}</div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-primary-500 font-medium">
              <span>Licensed real estate advisors</span>
            </div>
          </div>
          <Link
            href="/admin/staff"
            className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-accent-500 hover:text-accent-600 transition-colors"
          >
            <span>Manage Team</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Total Inventory */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-accent-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">
              Staff Inventory Sheet
            </span>
            <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center border border-accent-100">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-primary-900">{totalInventory}</div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-primary-500 font-medium">
              <span>Internal listings repository</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-primary-400">
            <span>Synchronized Database</span>
            <Layers className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* ── Portfolio Status & Leads Pipeline ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties by Status */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent-500" />
              <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
                Property Portfolio Status
              </h2>
            </div>
            <span className="text-xs font-bold text-primary-500">
              {totalProperties} Total
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Available */}
            <div>
              <div className="flex justify-between text-xs font-bold text-primary-800 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-500" />
                  Available For Market
                </span>
                <span>
                  {availableCount}{" "}
                  <span className="text-primary-400 font-normal">
                    ({totalProperties > 0 ? Math.round((availableCount / totalProperties) * 100) : 0}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-500 rounded-full transition-all"
                  style={{ width: `${totalProperties > 0 ? (availableCount / totalProperties) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Sold */}
            <div>
              <div className="flex justify-between text-xs font-bold text-primary-800 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary-700" />
                  Sold Deals
                </span>
                <span>
                  {soldCount}{" "}
                  <span className="text-primary-400 font-normal">
                    ({totalProperties > 0 ? Math.round((soldCount / totalProperties) * 100) : 0}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-700 rounded-full transition-all"
                  style={{ width: `${totalProperties > 0 ? (soldCount / totalProperties) * 100 : 0}%` }}
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
                    ({totalProperties > 0 ? Math.round((rentedCount / totalProperties) * 100) : 0}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-300 rounded-full transition-all"
                  style={{ width: `${totalProperties > 0 ? (rentedCount / totalProperties) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Reserved */}
            <div>
              <div className="flex justify-between text-xs font-bold text-primary-800 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary-400" />
                  Reserved / Token
                </span>
                <span>
                  {reservedCount}{" "}
                  <span className="text-primary-400 font-normal">
                    ({totalProperties > 0 ? Math.round((reservedCount / totalProperties) * 100) : 0}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-400 rounded-full transition-all"
                  style={{ width: `${totalProperties > 0 ? (reservedCount / totalProperties) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Pipeline Funnel */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent-500" />
              <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
                Client Inquiry Funnel
              </h2>
            </div>
            <Link
              href="/admin/clients"
              className="text-xs font-bold text-accent-500 hover:text-accent-600 transition-colors"
            >
              View Pipeline →
            </Link>
          </div>

          <div className="mt-5 space-y-2.5">
            {leadPipelineStages.map((stage) => {
              const pct = totalLeads > 0 ? Math.round((stage.count / totalLeads) * 100) : 0;
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
        {/* Recent Property Listings */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
                Latest Property Listings
              </h2>
              <Link
                href="/admin/properties"
                className="text-xs font-bold text-accent-500 hover:text-accent-600"
              >
                All Properties ({totalProperties})
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
            href="/admin/properties"
            className="mt-4 pt-3 border-t border-neutral-100 text-center text-xs font-bold text-primary-700 hover:text-accent-500 transition-colors block"
          >
            Manage All Properties →
          </Link>
        </div>

        {/* Recent Inquiries / Leads */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
                Recent Client Inquiries
              </h2>
              <Link
                href="/admin/clients"
                className="text-xs font-bold text-accent-500 hover:text-accent-600"
              >
                All Leads ({totalLeads})
              </Link>
            </div>

            <div className="mt-4 divide-y divide-neutral-100">
              {recentLeads.length === 0 ? (
                <p className="text-xs text-primary-400 py-6 text-center">No inquiries received yet.</p>
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
                      {lead.assignedStaff?.name && (
                        <p className="text-[10px] text-primary-400 mt-0.5 truncate max-w-[90px]">
                          Agent: {lead.assignedStaff.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/admin/clients"
            className="mt-4 pt-3 border-t border-neutral-100 text-center text-xs font-bold text-primary-700 hover:text-accent-500 transition-colors block"
          >
            Open Client Leads Table →
          </Link>
        </div>
      </div>
    </div>
  );
}
