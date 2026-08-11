import prisma from "@/lib/prisma";
import { Building2, Users, FileText, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  // Fetch global metrics concurrently
  const [
    totalProperties,
    totalLeads,
    totalStaff,
    propertiesByStatus,
    leadsByStatus,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.client.count(),
    prisma.user.count({ where: { role: "STAFF" } }),
    prisma.property.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.client.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  // Transform aggregations for easier rendering
  const getPropStatusCount = (status: string) =>
    propertiesByStatus.find((p) => p.status === status)?._count ?? 0;
  
  const getLeadStatusCount = (status: string) =>
    leadsByStatus.find((l) => l.status === status)?._count ?? 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-8 tracking-tight">Admin Dashboard</h1>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Properties</p>
            <p className="text-3xl font-bold text-neutral-900">{totalProperties}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Leads</p>
            <p className="text-3xl font-bold text-neutral-900">{totalLeads}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Active Staff</p>
            <p className="text-3xl font-bold text-neutral-900">{totalStaff}</p>
          </div>
        </div>
      </div>

      {/* Breakdowns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Properties Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-neutral-400" />
            Properties by Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50">
              <span className="flex items-center gap-2 font-medium text-neutral-700">
                <CheckCircle className="h-4 w-4 text-green-500" /> Available
              </span>
              <span className="text-lg font-bold text-neutral-900">{getPropStatusCount("AVAILABLE")}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50">
              <span className="flex items-center gap-2 font-medium text-neutral-700">
                <div className="h-4 w-4 rounded-full bg-blue-500" /> Sold
              </span>
              <span className="text-lg font-bold text-neutral-900">{getPropStatusCount("SOLD")}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50">
              <span className="flex items-center gap-2 font-medium text-neutral-700">
                <div className="h-4 w-4 rounded-full bg-purple-500" /> Rented
              </span>
              <span className="text-lg font-bold text-neutral-900">{getPropStatusCount("RENTED")}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50">
              <span className="flex items-center gap-2 font-medium text-neutral-700">
                <Clock className="h-4 w-4 text-orange-500" /> Reserved
              </span>
              <span className="text-lg font-bold text-neutral-900">{getPropStatusCount("RESERVED")}</span>
            </div>
          </div>
        </div>

        {/* Leads Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-neutral-400" />
            Leads Pipeline
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border-l-4 border-blue-500">
              <span className="font-medium text-neutral-700">New Inquiries</span>
              <span className="text-lg font-bold text-neutral-900">{getLeadStatusCount("NEW")}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border-l-4 border-yellow-500">
              <span className="font-medium text-neutral-700">Contacted</span>
              <span className="text-lg font-bold text-neutral-900">{getLeadStatusCount("CONTACTED")}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border-l-4 border-orange-500">
              <span className="font-medium text-neutral-700">Negotiating</span>
              <span className="text-lg font-bold text-neutral-900">{getLeadStatusCount("NEGOTIATING")}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border-l-4 border-green-500">
              <span className="font-medium text-neutral-700">Closed Won</span>
              <span className="text-lg font-bold text-neutral-900">{getLeadStatusCount("CLOSED")}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border-l-4 border-red-500">
              <span className="font-medium text-neutral-700">Closed Lost</span>
              <span className="text-lg font-bold text-neutral-900">{getLeadStatusCount("LOST")}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
