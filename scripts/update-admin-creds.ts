import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

// Use the real PostgreSQL database URL
const DATABASE_URL = "postgresql://neondb_owner:npg_9b2xVzACPMOj@ep-winter-band-azhei341-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL,
});

async function main() {
  // Delete the old admin user
  try {
    const deleted = await prisma.user.deleteMany({
      where: { email: "admin@saintmaryrajula.edu.in" },
    });
    console.log("Old admin user(s) deleted:", deleted.count);
  } catch (e) {
    console.log("Could not delete old admin:", e);
  }

  // Check if new admin already exists
  const existing = await prisma.user.findUnique({
    where: { email: "parthboricha933@gmail.com" },
  });

  if (existing) {
    // Update the password
    await prisma.user.update({
      where: { email: "parthboricha933@gmail.com" },
      data: {
        password: hashSync("66666666", 12),
      },
    });
    console.log("Existing admin password updated to: 66666666");
  } else {
    // Create the new admin
    await prisma.user.create({
      data: {
        email: "parthboricha933@gmail.com",
        name: "School Admin",
        password: hashSync("66666666", 12),
        role: "admin",
      },
    });
    console.log("New admin created: parthboricha933@gmail.com / 66666666");
  }

  // List all users
  const users = await prisma.user.findMany();
  console.log("Current users:", users.map(u => ({ id: u.id, email: u.email, role: u.role })));

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
