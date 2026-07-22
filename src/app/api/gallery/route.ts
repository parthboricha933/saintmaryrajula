import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all active gallery images (public)
export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}

// POST create gallery image (admin)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const image = await db.galleryImage.create({
      data: {
        title: data.title,
        category: data.category || "School Campus",
        imageUrl: data.imageUrl,
        alt: data.alt || data.title,
        active: data.active !== undefined ? data.active : true,
        order: data.order || 0,
      },
    });
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}

// PUT update gallery image (admin)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const image = await db.galleryImage.update({
      where: { id: data.id },
      data: {
        title: data.title,
        category: data.category,
        imageUrl: data.imageUrl,
        alt: data.alt,
        active: data.active,
        order: data.order,
      },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to update gallery image" },
      { status: 500 }
    );
  }
}

// DELETE gallery image (admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await db.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}
