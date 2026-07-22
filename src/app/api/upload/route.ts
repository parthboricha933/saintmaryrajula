import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "gallery";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 10MB` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Determine resize dimensions based on folder
    const isTeacherPhoto = folder === "teachers";
    const maxDim = isTeacherPhoto ? 400 : 2000;
    const jpegQuality = isTeacherPhoto ? 85 : 90;
    const filename = `${folder}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Process image with sharp
    let processedBuffer: Buffer;

    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      processedBuffer = await sharp(buffer)
        .resize(maxDim, maxDim, { fit: "cover", position: "center" })
        .jpeg({ quality: jpegQuality, mozjpeg: true })
        .toBuffer();
    } else if (file.type === "image/png") {
      processedBuffer = await sharp(buffer)
        .resize(maxDim, maxDim, { fit: "cover", position: "center" })
        .png({ compressionLevel: 6 })
        .toBuffer();
    } else if (file.type === "image/webp") {
      processedBuffer = await sharp(buffer)
        .resize(maxDim, maxDim, { fit: "cover", position: "center" })
        .webp({ quality: jpegQuality })
        .toBuffer();
    } else {
      // GIF — convert to JPEG for better quality
      processedBuffer = await sharp(buffer)
        .resize(maxDim, maxDim, { fit: "cover", position: "center" })
        .jpeg({ quality: jpegQuality, mozjpeg: true })
        .toBuffer();
    }

    // For teacher photos: always use base64 data URL (works on Vercel without Blob token)
    // This stores the photo directly in the database — no external storage needed
    if (isTeacherPhoto) {
      // Convert to JPEG first for consistency and smaller size
      const jpegBuffer = await sharp(processedBuffer)
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();
      const base64 = jpegBuffer.toString("base64");
      const dataUrl = `data:image/jpeg;base64,${base64}`;

      return NextResponse.json({
        url: dataUrl,
        filename: filename,
        message: "Teacher photo uploaded successfully (base64)",
        storageType: "base64",
      });
    }

    // For gallery/event images: try Vercel Blob first, then local filesystem
    // Try Vercel Blob first (production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(`${filename}.jpg`, processedBuffer, {
          access: "public",
          contentType: "image/jpeg",
        });
        return NextResponse.json({
          url: blob.url,
          filename: filename,
          message: "Image uploaded to Vercel Blob successfully",
          storageType: "blob",
        });
      } catch (blobError) {
        console.error("Vercel Blob upload failed:", blobError);
        // Fall through to local filesystem
      }
    }

    // Local filesystem upload (development)
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", folder);

    // Ensure directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, `${filename}.jpg`);
    await fs.writeFile(filePath, processedBuffer);

    const imageUrl = `/${folder}/${filename}.jpg`;

    return NextResponse.json({
      url: imageUrl,
      filename: filename,
      message: "Image uploaded successfully (local filesystem)",
      storageType: "local",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
