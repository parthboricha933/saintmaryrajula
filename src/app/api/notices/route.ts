import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all active notices (public)
export async function GET() {
  try {
    const notices = await db.notice.findMany({
      where: { active: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(notices);
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json(
      { error: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}

// POST create notice (admin)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const notice = await db.notice.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category || "General",
        date: data.date ? new Date(data.date) : new Date(),
        active: data.active !== undefined ? data.active : true,
      },
    });
    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { error: "Failed to create notice" },
      { status: 500 }
    );
  }
}

// PUT update notice (admin)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const notice = await db.notice.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        date: data.date ? new Date(data.date) : undefined,
        active: data.active,
      },
    });
    return NextResponse.json(notice);
  } catch (error) {
    console.error("Error updating notice:", error);
    return NextResponse.json(
      { error: "Failed to update notice" },
      { status: 500 }
    );
  }
}

// DELETE notice (admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await db.notice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json(
      { error: "Failed to delete notice" },
      { status: 500 }
    );
  }
}
