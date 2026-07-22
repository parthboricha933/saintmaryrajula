import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed gallery images
  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount === 0) {
    await prisma.galleryImage.createMany({
      data: [
        {
          title: "School Campus",
          category: "School Campus",
          imageUrl: "/gallery/download.jpg",
          alt: "Saint Mary School campus view",
          active: true,
          order: 1,
        },
        {
          title: "School Building Exterior",
          category: "School Campus",
          imageUrl: "/gallery/outside.jpg",
          alt: "Outside view of Saint Mary School building",
          active: true,
          order: 2,
        },
        {
          title: "Science Day Activities",
          category: "Science Activities",
          imageUrl: "/gallery/science-day.jpg",
          alt: "Students participating in Science Day activities",
          active: true,
          order: 3,
        },
        {
          title: "Computer Lab Session",
          category: "Classrooms",
          imageUrl: "/gallery/computer.jpg",
          alt: "Students working in the computer lab",
          active: true,
          order: 4,
        },
        {
          title: "Sports Day Events",
          category: "Sports Day",
          imageUrl: "/gallery/sports.jpg",
          alt: "Students participating in sports day events",
          active: true,
          order: 5,
        },
        {
          title: "Innovation & Projects",
          category: "Science Activities",
          imageUrl: "/gallery/innovation.jpg",
          alt: "Students showcasing innovative projects",
          active: true,
          order: 6,
        },
      ],
    });
    console.log("Gallery images seeded successfully!");
  } else {
    console.log("Gallery images already exist, skipping seed.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
