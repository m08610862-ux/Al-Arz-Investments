"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  UserSquare2,
  Settings,
  UserCircle,
  LogOut,
  MessageSquareQuote,
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
    { href: "/admin/properties", label: "Properties", icon: Building2 },
    { href: "/admin/clients", label: "Clients & Leads", icon: Users },
    { href: "/admin/inventory", label: "Inventory", icon: Package },
    { href: "/admin/staff", label: "Staff Management", icon: UserSquare2 },
    { href: "/admin/settings", label: "Site Settings", icon: Settings },
  ];

  const staffLinks = [
    { href: "/staff", label: "My Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/staff/properties", label: "My Properties", icon: Building2 },
    { href: "/staff/clients", label: "My Clients", icon: Users },
    { href: "/staff/inventory", label: "My Inventory", icon: Package },
    { href: "/staff/profile", label: "My Profile", icon: UserCircle },
  ];

  const links = role === "ADMIN" ? adminLinks : staffLinks;
  const panelTitle = role === "ADMIN" ? "Admin Panel" : "Staff Panel";

  return (
    <aside className="w-full md:w-64 bg-primary-900 border-r border-primary-800 shrink-0 flex flex-col text-primary-100 shadow-xl z-20">
      
      {/* Header with Logo */}
      <div className="p-6 border-b border-primary-800 flex flex-col items-center justify-center gap-3">
        <Link href="/" className="shrink-0 group">
          <div className="h-16 w-fit bg-white px-4 py-2 rounded-xl shadow-md flex items-center justify-center group-hover:shadow-lg transition-shadow">
            <Image
              src="/logo.png"
              alt="Al-Arz Investments"
              width={200}
              height={80}
              quality={100}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </Link>
        <div className="flex flex-col overflow-hidden text-center">
          <span className="font-bold text-[10px] text-white uppercase tracking-widest leading-none">
            {panelTitle}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? "bg-primary-800 text-white font-bold shadow-inner border border-primary-700/50"
                  : "font-medium text-primary-200 hover:bg-primary-800/50 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-accent-400" : "text-primary-400"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-primary-800 bg-primary-950/30">
        <div className="flex items-center gap-3 px-3 py-2 bg-primary-800/40 rounded-xl border border-primary-800/50 mb-2">
          <div className="h-9 w-9 rounded-full bg-accent-500 flex items-center justify-center shrink-0 shadow-inner">
            <span className="text-sm font-bold text-white shadow-sm">
              {user.name?.charAt(0).toUpperCase() || (role === "ADMIN" ? "A" : "S")}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-primary-300 truncate">
              {user.email}
            </p>
          </div>
        </div>
        {children}
      </div>
    </aside>
  );
}
