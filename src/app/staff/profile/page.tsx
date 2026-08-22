import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProfileImageUploader } from "@/components/staff/profile-image-uploader";
import {
  Mail,
  Phone,
  ShieldCheck,
  UserCircle,
  Building2,
  Users,
  FileSpreadsheet,
  Calendar,
  Briefcase,
  ExternalLink,
  Lock,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Profile | Staff Portal",
};

export default async function StaffProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      designation: true,
      createdAt: true,
      _count: {
        select: {
          createdProperties: true,
          assignedClients: true,
          staffInventories: true,
        },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6 w-full">
      {/* ── Top Header Bar ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-accent-500 flex items-center justify-center text-white shadow-md shrink-0">
            <UserCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-primary-900 tracking-tight">
                Staff Advisor Profile
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-50 text-accent-700 border border-accent-200">
                <ShieldCheck className="h-3 w-3" /> Licensed Advisor
              </span>
            </div>
            <p className="text-xs text-primary-500 mt-0.5">
              Manage your public avatar photo, personal advisor credentials, and workspace metrics.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Profile Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photo Uploader & Activity Overview */}
        <div className="space-y-6">
          {/* Photo Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 flex flex-col items-center">
            <div className="w-full pb-4 mb-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-primary-900 uppercase tracking-wide">
                Profile Photo
              </h2>
              <span className="text-[10px] text-primary-400 font-medium">Public Avatar</span>
            </div>

            <ProfileImageUploader
              currentImage={user.image}
              userName={user.name || "Staff"}
            />
          </div>

          {/* Activity Metric Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xs font-extrabold text-primary-900 uppercase tracking-wide pb-4 mb-4 border-b border-neutral-100">
              Workspace Overview
            </h2>

            <div className="space-y-3">
              <Link
                href="/staff/properties"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 text-accent-500" />
                  <span className="text-xs font-bold text-primary-800">My Properties</span>
                </div>
                <span className="text-xs font-black text-primary-900">
                  {user._count?.createdProperties || 0}
                </span>
              </Link>

              <Link
                href="/staff/clients"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-accent-500" />
                  <span className="text-xs font-bold text-primary-800">Assigned Leads</span>
                </div>
                <span className="text-xs font-black text-primary-900">
                  {user._count?.assignedClients || 0}
                </span>
              </Link>

              <Link
                href="/staff/inventory"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="h-4 w-4 text-accent-500" />
                  <span className="text-xs font-bold text-primary-800">Inventory Items</span>
                </div>
                <span className="text-xs font-black text-primary-900">
                  {user._count?.staffInventories || 0}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Account Information Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100">
              <div>
                <h2 className="text-sm font-extrabold text-primary-900 uppercase tracking-wide">
                  Account Details &amp; Contact Info
                </h2>
                <p className="text-xs text-primary-500 mt-0.5">
                  Official credentials associated with your advisor profile.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent-50 text-accent-700 border border-accent-200">
                STAFF ADVISOR
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="flex items-center gap-2 text-primary-400 text-xs mb-1">
                  <UserCircle className="h-3.5 w-3.5 text-accent-500" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">Full Name</span>
                </div>
                <p className="text-sm font-bold text-primary-900">{user.name}</p>
              </div>

              {/* Designation */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="flex items-center gap-2 text-primary-400 text-xs mb-1">
                  <Briefcase className="h-3.5 w-3.5 text-accent-500" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    Designation / Title
                  </span>
                </div>
                <p className="text-sm font-bold text-primary-900">
                  {user.designation || "Property Consultant"}
                </p>
              </div>

              {/* Email Address */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="flex items-center gap-2 text-primary-400 text-xs mb-1">
                  <Mail className="h-3.5 w-3.5 text-accent-500" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    Official Email
                  </span>
                </div>
                <p className="text-sm font-bold text-primary-900 truncate">{user.email}</p>
              </div>

              {/* Phone */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="flex items-center gap-2 text-primary-400 text-xs mb-1">
                  <Phone className="h-3.5 w-3.5 text-accent-500" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    WhatsApp / Phone
                  </span>
                </div>
                <p className="text-sm font-bold text-primary-900 font-mono">
                  {user.phone || <span className="text-neutral-400 italic">Not set</span>}
                </p>
              </div>

              {/* Account Role */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="flex items-center gap-2 text-primary-400 text-xs mb-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-500" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    Access Permission
                  </span>
                </div>
                <p className="text-sm font-bold text-primary-900">Staff Portal (Sales &amp; Listings)</p>
              </div>

              {/* Joined Date */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="flex items-center gap-2 text-primary-400 text-xs mb-1">
                  <Calendar className="h-3.5 w-3.5 text-accent-500" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    Advisor Since
                  </span>
                </div>
                <p className="text-sm font-bold text-primary-900">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Admin Modification Note */}
            <div className="mt-6 p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 flex items-start gap-3">
              <Lock className="h-4 w-4 text-primary-400 shrink-0 mt-0.5" />
              <div className="text-xs text-primary-500">
                <p className="font-bold text-primary-800 mb-0.5">Account Security &amp; Modifications</p>
                <p>
                  To change your registered name, login email, phone number, or system password, please contact the administrator via the Admin Panel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
