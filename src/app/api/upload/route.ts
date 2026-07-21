import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";

// POST upload image with quality preservation
// On Vercel: uses Vercel Blob storage (if BLOB_READ_WRITE_TOKEN is set)
// On local dev: saves to public/gallery/ directory
// Fallback: returns base64 data URL
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

    // Strategy 1: Vercel Blob (production on Vercel)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(filename, processedBuffer, {
          contentType,
          access: "public",
        });
        return NextResponse.json({
          url: blob.url,
          filename: filename,
          message: "Image uploaded to Vercel Blob",
        });
      } catch (blobError) {
        console.error("Blob upload failed, falling back:", blobError);
        // Fall through to local storage
      }
    }

    // Strategy 2: Local filesystem (development)
    try {
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
        message: "Image uploaded locally",
      });
    } catch (fsError) {
      console.error("Local storage failed:", fsError);
      // Fall through to base64
    }

    // Strategy 3: Base64 data URL (universal fallback - works on any platform)
    const base64 = processedBuffer.toString("base64");
    const dataUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      filename: filename.replace("gallery/", ""),
      message: "Image stored as base64 (cloud storage not configured)",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
