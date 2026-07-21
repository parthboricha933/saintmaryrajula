import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

// POST upload image with quality preservation
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

    // Generate unique filename
    const ext = path.extname(file.name) || ".jpg";
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${randomSuffix}${ext}`;

    // Ensure gallery directory exists
    const galleryDir = path.join(process.cwd(), "public", "gallery");
    await mkdir(galleryDir, { recursive: true });

    const filePath = path.join(galleryDir, filename);

    // Process image with sharp - keep quality high
    // For JPEG: quality 90 (high quality)
    // For PNG: use default lossless compression
    // Resize if too large (max 2000px on longest side for web, but keep quality)
    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      await sharp(buffer)
        .resize(2000, 2000, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(filePath);
    } else if (file.type === "image/png") {
      await sharp(buffer)
        .resize(2000, 2000, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .png({ compressionLevel: 6, quality: 90 })
        .toFile(filePath);
    } else if (file.type === "image/webp") {
      await sharp(buffer)
        .resize(2000, 2000, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 90 })
        .toFile(filePath);
    } else {
      // For GIF and others, just save directly
      await writeFile(filePath, buffer);
    }

    const imageUrl = `/gallery/${filename}`;

    return NextResponse.json({
      url: imageUrl,
      filename,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
