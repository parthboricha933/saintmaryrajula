import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all active announcements (public)
export async function GET() {
  try {
    const announcements = await db.announcement.findMany({
      where: { active: true },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

// POST create announcement (admin)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const announcement = await db.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        priority: data.priority || "normal",
        active: data.active !== undefined ? data.active : true,
      },
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

// PUT update announcement (admin)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const announcement = await db.announcement.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        priority: data.priority,
        active: data.active,
      },
    });
    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

// DELETE announcement (admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await db.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
