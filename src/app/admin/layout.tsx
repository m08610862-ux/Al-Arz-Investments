import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { 
  Building2, 
  Users, 
  LayoutDashboard, 
  LogOut, 
  Package, 
  UserSquare2,
  Settings
} from "lucide-react";
import { signOut } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Role Protection: Redirect non-admins to the standard staff panel
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/staff");
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-neutral-50">
      <Sidebar role="ADMIN" user={{ name: session.user.name, email: session.user.email }}>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-primary-300 hover:bg-rose-500/15 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition-all group cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-primary-400 group-hover:text-rose-300 transition-colors" />
            <span>Sign Out</span>
          </button>
        </form>
      </Sidebar>

      {/* Main Content Area — scrolls independently */}
      <main className="flex-1 h-full overflow-y-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
