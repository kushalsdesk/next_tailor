import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { GalleryImage } from "@/lib/models";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDB();
  try {
    const deleted = await GalleryImage.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
