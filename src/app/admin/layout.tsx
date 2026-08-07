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
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <Sidebar role="ADMIN" user={{ name: session.user.name, email: session.user.email }}>
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

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}
