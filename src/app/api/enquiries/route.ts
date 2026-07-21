import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/enquiries — List all enquiries (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const enquiries = await db.admissionInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

// POST /api/enquiries — Submit a new enquiry (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, class: className, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const enquiry = await db.admissionInquiry.create({
      data: {
        name,
        email,
        phone,
        class: className || "Not specified",
        message: message || null,
        status: "pending",
      },
    });

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}

// PUT /api/enquiries — Update enquiry status (admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Enquiry ID is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "contacted", "admitted", "closed"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Use: pending, contacted, admitted, or closed" },
        { status: 400 }
      );
    }

    const enquiry = await db.admissionInquiry.update({
      where: { id },
      data: { status: status || undefined },
    });

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}

// DELETE /api/enquiries — Delete an enquiry (admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Enquiry ID is required" },
        { status: 400 }
      );
    }

    await db.admissionInquiry.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
