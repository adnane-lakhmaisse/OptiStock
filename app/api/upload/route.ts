import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises"; 
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
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
}