import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Fetch teachers (public: approved only, admin: all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const all = searchParams.get("all");

    if (all === "true") {
      const teachers = await db.teacher.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(teachers);
    }

    if (status) {
      const teachers = await db.teacher.findMany({
        where: { status },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(teachers);
    }

    // Public: only approved teachers
    const teachers = await db.teacher.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

// POST: Teacher signup (pending status)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, googleId, designation, subject, qualification, experience, languages } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existing = await db.teacher.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({
        message: "Teacher already exists",
        teacher: existing,
        status: existing.status,
      });
    }

    const teacher = await db.teacher.create({
      data: {
        name,
        email,
        googleId: googleId || null,
        designation: designation || "Teacher",
        subject: subject || "General",
        qualification: qualification || "",
        experience: experience || 0,
        languages: languages || "English, Hindi, Gujarati",
        status: "pending",
      },
    });

    return NextResponse.json({
      message: "Teacher registration submitted. Waiting for admin approval.",
      teacher,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}

// PUT: Update teacher profile or approve/reject
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    if (action === "approve") {
      const teacher = await db.teacher.update({
        where: { id },
        data: { status: "approved" },
      });
      return NextResponse.json({ message: "Teacher approved successfully", teacher });
    }

    if (action === "reject") {
      const teacher = await db.teacher.update({
        where: { id },
        data: { status: "rejected" },
      });
      return NextResponse.json({ message: "Teacher rejected", teacher });
    }

    const allowedFields = ["name", "designation", "subject", "qualification", "experience", "languages", "shortIntro", "teachingPhilosophy", "photo"];
    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        data[field] = updateData[field];
      }
    }

    const teacher = await db.teacher.update({
      where: { id },
      data,
    });

    return NextResponse.json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
}

// DELETE: Remove a teacher
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    await db.teacher.delete({ where: { id } });

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}
