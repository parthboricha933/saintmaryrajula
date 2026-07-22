import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all active events (public)
export async function GET() {
  try {
    const events = await db.schoolEvent.findMany({
      where: { active: true },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(
      events.map((e) => ({
        ...e,
        date: e.date.toISOString(),
        endTime: e.endTime?.toISOString() || null,
      }))
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST create event (admin)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const event = await db.schoolEvent.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        endTime: data.endTime ? new Date(data.endTime) : null,
        venue: data.venue || "School Campus",
        category: data.category || "General",
        image: data.image || null,
        active: data.active !== undefined ? data.active : true,
      },
    });
    return NextResponse.json(
      { ...event, date: event.date.toISOString(), endTime: event.endTime?.toISOString() || null },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

// PUT update event (admin)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const event = await db.schoolEvent.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : null,
        venue: data.venue,
        category: data.category,
        image: data.image,
        active: data.active,
      },
    });
    return NextResponse.json({
      ...event,
      date: event.date.toISOString(),
      endTime: event.endTime?.toISOString() || null,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE event (admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await db.schoolEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
