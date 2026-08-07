import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Building2,
  Users,
  LayoutDashboard,
  LogOut,
  Package,
  UserCircle,
} from "lucide-react";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect if not logged in
  if (!session?.user) {
    redirect("/login");
  }

  // Enforce STAFF role (Admins go to /admin, others to /login)
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  } else if (session.user.role !== "STAFF") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar role="STAFF" user={{ name: session.user.name, email: session.user.email }}>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-200 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
          >
            <LogOut className="h-5 w-5 text-primary-400 group-hover:text-red-400 transition-colors" />
            Sign Out
          </button>
        </form>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
