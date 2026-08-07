import prisma from "@/lib/prisma";
import { StaffTable } from "@/components/admin/staff-table";

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
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <StaffTable staffList={staff} />
    </div>
  );
}
