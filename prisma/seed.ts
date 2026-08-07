import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ─── Cleanup (order matters due to FK constraints) ───────────
  await prisma.inventoryItem.deleteMany();
  await prisma.client.deleteMany();
  await prisma.property.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // ─── Hash passwords ──────────────────────────────────────────
  const SALT_ROUNDS = 12;
  const adminPassword = await bcrypt.hash("Admin@123!", SALT_ROUNDS);
  const staffPassword = await bcrypt.hash("Staff@123!", SALT_ROUNDS);

  // ─── Create Admin ────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@alarz.com",
      password: adminPassword,
      role: Role.ADMIN,
      phone: "+92-300-0000001",
      isActive: true,
    },
  });
  console.log(`✅ Created ADMIN: ${admin.email}`);

  // ─── Create Staff 1 ─────────────────────────────────────────
  const staff1 = await prisma.user.create({
    data: {
      name: "Sarah Khan",
      email: "staff1@alarz.com",
      password: staffPassword,
      role: Role.STAFF,
      phone: "+92-300-0000002",
      isActive: true,
    },
  });
  console.log(`✅ Created STAFF: ${staff1.email}`);

  // ─── Create Staff 2 ─────────────────────────────────────────
  const staff2 = await prisma.user.create({
    data: {
      name: "Ahmed Raza",
      email: "staff2@alarz.com",
      password: staffPassword,
      role: Role.STAFF,
      phone: "+92-300-0000003",
      isActive: true,
    },
  });
  console.log(`✅ Created STAFF: ${staff2.email}`);

  // ─── Seed Sample Properties ──────────────────────────────────
  const property1 = await prisma.property.create({
    data: {
      title: "Luxury 5 Marla House — DHA Phase 2",
      description:
        "A beautifully designed 5 marla house in DHA Phase 2, Islamabad. Fully furnished with modern amenities, backup power, and a serene garden.",
      price: 25000000,
      type: "SALE",
      category: "HOUSE",
      address: "Street 12, Block D, DHA Phase 2",
      city: "Islamabad",
      bedrooms: 4,
      bathrooms: 3,
      area: 1125,
      status: "AVAILABLE",
      featured: true,
      images: [],
      createdById: staff1.id,
      assignedToId: staff1.id,
    },
  });

  const property2 = await prisma.property.create({
    data: {
      title: "Commercial Plot — Blue Area",
      description:
        "Prime commercial plot available in Blue Area, Islamabad. Ideal for office building or retail centre. All utilities available.",
      price: 80000000,
      type: "SALE",
      category: "PLOT",
      address: "Plot 45, Jinnah Avenue, Blue Area",
      city: "Islamabad",
      area: 4000,
      status: "AVAILABLE",
      featured: false,
      images: [],
      createdById: staff2.id,
      assignedToId: staff2.id,
    },
  });

  const property3 = await prisma.property.create({
    data: {
      title: "2-Bed Apartment for Rent — Bahria Town",
      description:
        "Well-maintained 2-bedroom apartment on the 4th floor in Bahria Town, Rawalpindi. Close to all amenities including schools, hospitals, and shopping.",
      price: 65000,
      type: "RENT",
      category: "APARTMENT",
      address: "Block B, Precinct 11, Bahria Town",
      city: "Rawalpindi",
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      status: "AVAILABLE",
      featured: true,
      images: [],
      createdById: staff1.id,
    },
  });

  console.log(`✅ Created ${3} sample properties`);

  // ─── Seed Sample Inventory (for apartment project) ──────────
  await prisma.inventoryItem.createMany({
    data: [
      {
        propertyId: property3.id,
        unitNumber: "4A",
        floor: 4,
        area: 950,
        price: 65000,
        status: "AVAILABLE",
        quantity: 1,
      },
      {
        propertyId: property3.id,
        unitNumber: "4B",
        floor: 4,
        area: 950,
        price: 67000,
        status: "RESERVED",
        quantity: 1,
      },
    ],
  });
  console.log(`✅ Created inventory units for apartment property`);

  // ─── Seed Sample Clients ─────────────────────────────────────
  await prisma.client.createMany({
    data: [
      {
        name: "Bilal Mahmood",
        phone: "+92-321-1234567",
        email: "bilal@example.com",
        message: "Interested in the DHA house. When can we schedule a visit?",
        source: "WEBSITE",
        status: "NEW",
        propertyId: property1.id,
        assignedStaffId: staff1.id,
      },
      {
        name: "Fatima Zahra",
        phone: "+92-333-9876543",
        email: "fatima@example.com",
        message: "Looking for a 2-bed apartment, what is your best price?",
        source: "PHONE",
        status: "CONTACTED",
        propertyId: property3.id,
        assignedStaffId: staff2.id,
        notes: "Called back on 3rd Aug. Sending property brochure via WhatsApp.",
      },
      {
        name: "Usman Tariq",
        phone: "+92-311-5554433",
        source: "REFERRAL",
        status: "NEGOTIATING",
        propertyId: property2.id,
        assignedStaffId: staff2.id,
        notes: "Referred by existing client. Serious buyer. Negotiating price.",
      },
    ],
  });
  console.log(`✅ Created 3 sample clients/leads`);

  // ─── Summary ─────────────────────────────────────────────────
  console.log("\n🎉 Seed completed successfully!\n");
  console.log("─────────────────────────────────────────");
  console.log("  Login Credentials:");
  console.log("  ADMIN  → admin@alarz.com  / Admin@123!");
  console.log("  STAFF  → staff1@alarz.com / Staff@123!");
  console.log("  STAFF  → staff2@alarz.com / Staff@123!");
  console.log("─────────────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
