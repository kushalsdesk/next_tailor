import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { GalleryImage } from "@/lib/models";

// GET all gallery metadata
export async function GET() {
  await connectToDB();
  try {
    // Select everything except the massive 'data' buffer for faster load times
    const images = await GalleryImage.find().select("-data").sort({ order: 1 });
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// POST new image
export async function POST(req: Request) {
  await connectToDB();
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Get highest order
    const highestOrderImg = await GalleryImage.findOne().sort("-order").select("order");
    const nextOrder = highestOrderImg ? highestOrderImg.order + 1 : 0;

    const newImage = await GalleryImage.create({
      data: buffer,
      contentType: file.type,
      order: nextOrder,
    });

    // We don't want to send the buffer back in JSON, so we omit it
    return NextResponse.json({
      _id: newImage._id,
      contentType: newImage.contentType,
      order: newImage.order,
      createdAt: newImage.createdAt
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
