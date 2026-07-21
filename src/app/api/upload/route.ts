import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";

// POST upload image with quality preservation
// Uses Vercel Blob for persistent storage (works on serverless)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image with sharp - keep quality high
    let processedBuffer: Buffer;
    let contentType: string = file.type;

    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      processedBuffer = await sharp(buffer)
        .resize(2000, 2000, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 90, mozjpeg: true })
        .toBuffer();
      contentType = "image/jpeg";
    } else if (file.type === "image/png") {
      processedBuffer = await sharp(buffer)
        .resize(2000, 2000, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .png({ compressionLevel: 6 })
        .toBuffer();
      contentType = "image/png";
    } else if (file.type === "image/webp") {
      processedBuffer = await sharp(buffer)
        .resize(2000, 2000, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 90 })
        .toBuffer();
      contentType = "image/webp";
    } else {
      // For GIF, just pass through
      processedBuffer = buffer;
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || "jpg";
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `gallery/${timestamp}-${randomSuffix}.${ext}`;

    // Check if BLOB_READ_WRITE_TOKEN is available (Vercel production)
    // If not, fall back to local filesystem storage (development)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Upload to Vercel Blob
      const blob = await put(filename, processedBuffer, {
        contentType,
        access: "public",
      });

      return NextResponse.json({
        url: blob.url,
        filename: filename,
        message: "Image uploaded successfully",
      });
    } else {
      // Development fallback: save to public/gallery/ directory
      const { writeFile, mkdir } = await import("fs/promises");
      const path = await import("path");

      const galleryDir = path.join(process.cwd(), "public", "gallery");
      await mkdir(galleryDir, { recursive: true });

      const localFilename = filename.replace("gallery/", "");
      const filePath = path.join(galleryDir, localFilename);
      await writeFile(filePath, processedBuffer);

      return NextResponse.json({
        url: `/gallery/${localFilename}`,
        filename: localFilename,
        message: "Image uploaded successfully (local)",
      });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
