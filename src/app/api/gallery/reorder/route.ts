import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { GalleryImage } from "@/lib/models";

export async function PUT(req: Request) {
  await connectToDB();
  try {
    const { updates } = await req.json(); // [{ _id: '123', order: 0 }, ...]
    
    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // BulkWrite is blazing fast for this
    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update._id },
        update: { $set: { order: update.order } },
      },
    }));

    await GalleryImage.bulkWrite(bulkOps);

    return NextResponse.json({ success: true, message: "Gallery reordered" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to reorder gallery" }, { status: 500 });
  }
}
