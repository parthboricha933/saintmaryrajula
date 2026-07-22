import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "parthboricha933@gmail.com" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "parthboricha933@gmail.com",
        name: "School Admin",
        password: hashSync("66666666", 12),
        role: "admin",
      },
    });
    console.log("Admin user created: parthboricha933@gmail.com / 66666666");
  } else {
    console.log("Admin user already exists");
  }

  // Seed notices
  const noticeCount = await prisma.notice.count();
  if (noticeCount === 0) {
    await prisma.notice.createMany({
      data: [
        {
          title: "Annual Day Celebration 2025-26",
          content:
            "All parents are cordially invited to attend the Annual Day Celebration on 15th December 2025. Students should report by 4:00 PM. Cultural performances will begin at 5:00 PM.",
          category: "Event",
          date: new Date("2025-12-15"),
          active: true,
        },
        {
          title: "Winter Vacation Notice",
          content:
            "School will remain closed for winter vacation from 25th December 2025 to 5th January 2026. School reopens on 6th January 2026. Complete holiday homework before reopening.",
          category: "Holiday",
          date: new Date("2025-12-20"),
          active: true,
        },
        {
          title: "Unit Test Schedule - Term 2",
          content:
            "Unit Test for Term 2 will commence from 10th November 2025. Students must prepare all subjects. The detailed timetable has been shared with class teachers.",
          category: "Academic",
          date: new Date("2025-11-01"),
          active: true,
        },
        {
          title: "Parent-Teacher Meeting",
          content:
            "PTM for Classes 1-8 will be held on 20th October 2025 from 9:00 AM to 1:00 PM. Parents are requested to attend mandatorily to discuss their child's progress.",
          category: "Academic",
          date: new Date("2025-10-20"),
          active: true,
        },
      ],
    });
    console.log("Sample notices seeded");
  }

  // Seed events
  const eventCount = await prisma.schoolEvent.count();
  if (eventCount === 0) {
    await prisma.schoolEvent.createMany({
      data: [
        {
          title: "Republic Day Celebration",
          description:
            "Join us for the 77th Republic Day celebration with flag hoisting, patriotic songs, and cultural performances by students.",
          date: new Date("2026-01-26T09:00:00"),
          endTime: new Date("2026-01-26T12:00:00"),
          venue: "School Playground",
          category: "Celebration",
          active: true,
        },
        {
          title: "Annual Sports Day",
          description:
            "A day full of athletic competitions, team sports, and fun activities. All students from Nursery to Class 8 will participate in various events.",
          date: new Date("2026-02-15T08:00:00"),
          endTime: new Date("2026-02-15T16:00:00"),
          venue: "School Playground",
          category: "Sports",
          active: true,
        },
        {
          title: "Science Exhibition",
          description:
            "Students showcase their innovative science projects and experiments. Parents and community members are invited to explore the exhibits.",
          date: new Date("2026-03-10T10:00:00"),
          endTime: new Date("2026-03-10T14:00:00"),
          venue: "School Activity Hall",
          category: "Academic",
          active: true,
        },
        {
          title: "Navratri Celebration",
          description:
            "Nine days of garba and cultural activities celebrating the festival of Navratri with traditional dance and music performances.",
          date: new Date("2025-10-01T18:00:00"),
          endTime: new Date("2025-10-01T21:00:00"),
          venue: "School Campus",
          category: "Cultural",
          active: true,
        },
        {
          title: "Teacher's Day",
          description:
            "A special day to honor and appreciate our dedicated teachers. Students prepare heartfelt performances and activities to show their gratitude.",
          date: new Date("2025-09-05T09:00:00"),
          endTime: new Date("2025-09-05T13:00:00"),
          venue: "School Auditorium",
          category: "Celebration",
          active: true,
        },
      ],
    });
    console.log("Sample events seeded");
  }

  // Seed announcements
  const announcementCount = await prisma.announcement.count();
  if (announcementCount === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          title: "Admissions Open for 2026-27",
          content:
            "Admissions are now open for Nursery to Class 8 for the academic year 2026-27. Collect application forms from the school office or download from the website. Early bird discount available for registrations before March 2026.",
          priority: "high",
          active: true,
        },
        {
          title: "New Computer Lab Inaugurated",
          content:
            "We are pleased to announce the inauguration of our new state-of-the-art computer lab equipped with 30 modern systems, high-speed internet, and interactive learning software. This will greatly enhance our digital literacy program.",
          priority: "normal",
          active: true,
        },
        {
          title: "School Bus Service Expanded",
          content:
            "Starting from January 2026, the school bus service has been expanded to cover additional routes including Chhatdiya Road, Krishna Park Colony, and Rajula Station area. Contact the office for route details and fees.",
          priority: "normal",
          active: true,
        },
        {
          title: "Holiday on Independence Day",
          content:
            "School will remain closed on 15th August 2025 on account of Independence Day. However, students participating in the flag hoisting ceremony should report at 8:00 AM in proper school uniform.",
          priority: "high",
          active: true,
        },
      ],
    });
    console.log("Sample announcements seeded");
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
