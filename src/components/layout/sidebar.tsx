"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserSquare2,
  Settings,
  UserCircle,
  FileSpreadsheet,
  ExternalLink,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

type Role = "ADMIN" | "STAFF";

type SidebarProps = {
  role: Role;
  user: {
    name: string | null | undefined;
    email: string | null | undefined;
  };
  children?: React.ReactNode;
};

export function Sidebar({ role, user, children }: SidebarProps) {
  const pathname = usePathname();

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/inventory", label: "Inventory", icon: FileSpreadsheet },
    { href: "/admin/properties", label: "Properties", icon: Building2 },
    { href: "/admin/clients", label: "Clients & Leads", icon: Users },
    { href: "/admin/staff", label: "Staff Management", icon: UserSquare2 },
    { href: "/admin/settings", label: "Site Settings", icon: Settings },
  ];

  const staffLinks = [
    { href: "/staff", label: "My Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/staff/inventory", label: "Inventory Sheet", icon: FileSpreadsheet },
    { href: "/staff/properties", label: "My Properties", icon: Building2 },
    { href: "/staff/clients", label: "My Clients", icon: Users },
    { href: "/staff/profile", label: "My Profile", icon: UserCircle },
  ];

  const links = role === "ADMIN" ? adminLinks : staffLinks;
  const isRoleAdmin = role === "ADMIN";

  return (
    <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-primary-900 border-r border-primary-800 shrink-0 flex flex-col text-primary-100 z-30 select-none shadow-xl">
      {/* ── Logo & Brand Header ────────────────────────────────────────── */}
      <div className="p-5 border-b border-primary-800/80 flex flex-col items-center justify-center gap-3 bg-primary-950/40">
        <Link href="/" className="shrink-0 group">
          <div className="h-14 w-fit bg-white px-3.5 py-1.5 rounded-xl shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
            <Image
              src="/logo.png"
              alt="Al-Arz Investments"
              width={180}
              height={70}
              quality={100}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Role Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-800/80 border border-primary-700/60">
          {isRoleAdmin ? (
            <ShieldCheck className="h-3 w-3 text-accent-400" />
          ) : (
            <Briefcase className="h-3 w-3 text-accent-400" />
          )}
          <span className="font-bold text-[10px] text-primary-200 uppercase tracking-widest leading-none">
            {isRoleAdmin ? "Admin Control Panel" : "Staff Advisor Portal"}
          </span>
        </div>
      </div>

      {/* ── Navigation Links (Fixed scroll area inside sidebar only) ──── */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-primary-800">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-primary-400">
          Navigation
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative ${
                isActive
                  ? "bg-accent-500 text-white shadow-md shadow-accent-500/20 font-bold"
                  : "text-primary-300 hover:text-white hover:bg-primary-800/60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-primary-400"
                  }`}
                />
                <span className="truncate">{link.label}</span>
              </div>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
              )}
            </Link>
          );
        })}

        {/* External Public Website Shortcut */}
        <div className="pt-3 mt-3 border-t border-primary-800/60">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-primary-400 hover:text-primary-200 hover:bg-primary-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Website</span>
            </div>
            <span className="text-[10px] text-primary-500">Live ↗</span>
          </Link>
        </div>
      </div>

      {/* ── User Profile & Sign Out Footer ─────────────────────────────── */}
      <div className="p-3 border-t border-primary-800/80 bg-primary-950/60 space-y-2">
        <div className="flex items-center gap-2.5 px-2.5 py-2 bg-primary-800/40 rounded-xl border border-primary-700/30">
          <div className="h-8 w-8 rounded-lg bg-accent-500 flex items-center justify-center shrink-0 shadow-inner">
            <span className="text-xs font-bold text-white">
              {user.name?.charAt(0).toUpperCase() || (isRoleAdmin ? "A" : "S")}
            </span>
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {user.name || "User"}
            </p>
            <p className="text-[10px] text-primary-400 truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Sign Out Component Container */}
        <div>{children}</div>
      </div>
    </aside>
  );
}
