import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { GalleryImage } from "@/lib/models";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDB();
  try {
    const image = await GalleryImage.findById(params.id).select("data contentType");
    
    if (!image) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Next.js response streaming the pure buffer with proper headers
    return new NextResponse(image.data, {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Heavily cache locally
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to load image", { status: 500 });
  }
}
