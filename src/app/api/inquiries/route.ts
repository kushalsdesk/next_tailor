import connectToDB from "@/lib/mongoose";
import { Inquiry } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    
    await connectToDB();
    const query = userId ? { userId } : {};
    const applications = await Inquiry.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
