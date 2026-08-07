import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProfileImageUploader } from "@/components/staff/profile-image-uploader";
import { Mail, Phone, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "My Profile | Staff Panel",
};

export default async function StaffProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, image: true, role: true, createdAt: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">My Profile</h1>
        <p className="text-neutral-500 mt-1">Manage your profile photo and view your account details.</p>
      </div>

      {/* Photo Upload Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 flex flex-col items-center">
        <h2 className="text-lg font-bold text-neutral-900 mb-6">Profile Photo</h2>
        <ProfileImageUploader
          currentImage={user.image}
          userName={user.name || "Staff"}
        />
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
        <h2 className="text-lg font-bold text-neutral-900 mb-6">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Full Name</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email Address</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">{user.email}</p>
            </div>
          </div>

          {user.phone && (
            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Phone</p>
                <p className="text-sm font-bold text-neutral-900 mt-0.5">{user.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Role</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">{user.role}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-400 mt-6">
          To change your name, email, phone or password, please contact your Admin.
        </p>
      </div>
    </div>
  );
}
