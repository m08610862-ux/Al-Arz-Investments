import prisma from "@/lib/prisma";
import { StaffTable } from "@/components/admin/staff-table";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const staff = await prisma.user.findMany({
    where: {
      role: "STAFF",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      isActive: true,
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

  return (
    <div className="space-y-6">
      <StaffTable staffList={staff} />
    </div>
  );
}
