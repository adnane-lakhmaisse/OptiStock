import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image: File | null = formData.get("image") as unknown as File;

    if (!image) {
      return NextResponse.json({
        success: false,
        message: "No image file provided.",
      });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = image.name.split(".").pop();
    const uniqueName = `image_${crypto.randomUUID()}.${ext}`;
    const filePath = join(uploadDir, uniqueName);
    const publicPath = `/uploads/${uniqueName}`;

    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "Failed to save image : " + (error as Error).message,
      });
    }

    return NextResponse.json({
      success: true,
      imageUrl: publicPath,
    });
  } catch (error) {
    throw new Error("Error processing upload: " + (error as Error).message);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json();
    if (!path) {
      return NextResponse.json({
        success: false,
        message: "No image path provided.",
      });
    }

    const filePath = join(process.cwd(), "public", path);

    if (existsSync(filePath)) {
      await unlink(filePath);
      return NextResponse.json({
        success: true,
        message: "Image deleted successfully.",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Image file does not exist.",
      });
    }

  } catch (error) {
    throw new Error("Error processing delete: " + (error as Error).message);
  }
}
