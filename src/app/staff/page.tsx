import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { Building2, Users, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default async function StaffDashboard() {
  const session = await requireAuth();
  const staffId = session.user.id;

  // All queries are scoped to THIS staff member only
  const [
    myPropertyCount,
    myLeadCount,
    myPropertiesByStatus,
    myLeadsByStatus,
    recentLeads,
  ] = await Promise.all([
    prisma.property.count({
      where: { OR: [{ createdById: staffId }, { assignedToId: staffId }] },
    }),
    prisma.client.count({
      where: { assignedStaffId: staffId },
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
  ]);


  const getPropCount = (status: string) =>
    myPropertiesByStatus.find((p) => p.status === status)?._count ?? 0;

  const getLeadCount = (status: string) =>
    myLeadsByStatus.find((l) => l.status === status)?._count ?? 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
        My Dashboard
      </h1>
      <p className="text-neutral-500 mb-8">
        Welcome back, {session.user.name}! Here&apos;s your overview.
      </p>


      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">My Properties</p>
            <p className="text-3xl font-bold text-neutral-900">{myPropertyCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Available</p>
            <p className="text-3xl font-bold text-neutral-900">{getPropCount("AVAILABLE")}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">My Leads</p>
            <p className="text-3xl font-bold text-neutral-900">{myLeadCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">New Inquiries</p>
            <p className="text-3xl font-bold text-neutral-900">{getLeadCount("NEW")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Pipeline */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">My Lead Pipeline</h2>
          <div className="space-y-3">
            {[
              { label: "New", status: "NEW", color: "bg-blue-500" },
              { label: "Contacted", status: "CONTACTED", color: "bg-yellow-500" },
              { label: "Negotiating", status: "NEGOTIATING", color: "bg-orange-500" },
              { label: "Closed (Won)", status: "CLOSED", color: "bg-green-500" },
              { label: "Lost", status: "LOST", color: "bg-red-500" },
            ].map(({ label, status, color }) => (
              <div key={status} className={`flex items-center justify-between p-3 rounded-xl bg-neutral-50 border-l-4 ${color}`}>
                <span className="font-medium text-neutral-700 text-sm">{label}</span>
                <span className="text-lg font-bold text-neutral-900">{getLeadCount(status)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900">Recent Leads</h2>
            <Link href="/staff/clients" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeads.length === 0 && (
              <p className="text-neutral-500 text-sm text-center py-8">No leads yet.</p>
            )}
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-start justify-between gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="overflow-hidden">
                  <p className="font-semibold text-neutral-900 text-sm truncate">{lead.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{lead.property?.title ?? "General Inquiry"}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                    lead.status === "NEW" ? "bg-blue-100 text-blue-700" :
                    lead.status === "CONTACTED" ? "bg-yellow-100 text-yellow-700" :
                    lead.status === "NEGOTIATING" ? "bg-orange-100 text-orange-700" :
                    lead.status === "CLOSED" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
