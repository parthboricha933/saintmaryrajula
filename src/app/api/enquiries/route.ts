import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

// Email transporter (created lazily to use env vars at runtime)
function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Send auto-reply email to the enquirer
async function sendAutoReply(name: string, email: string, className: string) {
  const mailOptions = {
    from: `"Saint Mary School, Rajula" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Thank you for your interest in Saint Mary School, Rajula!",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1B2A4A 0%, #2D3E5F 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #C5963A; margin: 0; font-size: 22px; letter-spacing: 0.5px;">Saint Mary School</h1>
          <p style="color: #e2e8f0; margin: 4px 0 0 0; font-size: 13px;">Rajula, Gujarat | GSEB Affiliated</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; color: #1B2A4A; margin: 0 0 8px 0;">Dear ${name},</p>
          
          <p style="font-size: 14px; color: #4b5563; line-height: 1.7; margin: 0 0 20px 0;">
            Thank you for showing interest in <strong>Saint Mary School, Rajula</strong>. We have received your admission enquiry${className && className !== "Not specified" ? ` for <strong>${className}</strong>` : ""} and truly appreciate your consideration of our school for your child's education.
          </p>

          <div style="background: #f8f9fa; border-left: 4px solid #C5963A; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 0 0 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;"><strong style="color: #1B2A4A;">What happens next?</strong></p>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #4b5563; line-height: 1.8;">
              <li>Our admissions team will review your enquiry</li>
              <li>We will contact you within 1-2 working days</li>
              <li>You will receive details about the admission process, fee structure, and campus visit</li>
            </ul>
          </div>

          <p style="font-size: 14px; color: #4b5563; line-height: 1.7; margin: 0 0 20px 0;">
            In the meantime, if you have any urgent questions, feel free to reach out to us directly.
          </p>

          <!-- Contact Info -->
          <div style="background: #1B2A4A; border-radius: 8px; padding: 16px 20px; margin: 0 0 20px 0;">
            <p style="color: #C5963A; margin: 0 0 8px 0; font-size: 13px; font-weight: 600;">Contact Us</p>
            <p style="color: #e2e8f0; margin: 0; font-size: 12px; line-height: 1.8;">
              📞 Phone: +91 98765 43210<br>
              ✉️ Email: saintmaryrajula@gmail.com<br>
              📍 Address: Rajula, Amreli, Gujarat, India
            </p>
          </div>

          <p style="font-size: 14px; color: #4b5563; margin: 0;">
            We look forward to welcoming your family to Saint Mary School!
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 11px; color: #9ca3af;">
            © ${new Date().getFullYear()} Saint Mary School, Rajula. All rights reserved.<br>
            Learning Today, Leading Tomorrow
          </p>
        </div>
      </div>
    `,
  };

  try {
    await getTransporter().sendMail(mailOptions);
    console.log(`Auto-reply email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send auto-reply email:", error);
    return false;
  }
}

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

    // Send auto-reply email (await so Vercel serverless stays alive to complete it)
    // Don't fail the enquiry if email fails — just log the error
    try {
      await sendAutoReply(name, email, className || "Not specified");
    } catch (emailError) {
      console.error("Auto-reply email failed:", emailError);
    }

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
