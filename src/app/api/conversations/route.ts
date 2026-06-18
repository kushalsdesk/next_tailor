import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { Conversation } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    // 1. Fetch exact conversation for a USER
    if (userId) {
      const conv = await Conversation.findOne({ userId });
      
      // Do NOT auto-create here. Just return the conversation or null.
      if (!conv) {
        return NextResponse.json(null);
      }
      return NextResponse.json(conv);
    } 
    
    // 2. Fetch ALL conversations for ADMIN
    // We will also join with User collection to get displayName and photo
    const convos = await Conversation.aggregate([
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: "users", // Mongoose pluralizes User to users automatically
          localField: "userId",
          foreignField: "uid",
          as: "userInfo"
        }
      },
      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } }
    ]);
    return NextResponse.json(convos);

  } catch (error) {
    console.error("Conversations API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conv = await Conversation.create({
      userId: body.userId,
      lastMessage: "",
      from: "user"
    });

    return NextResponse.json(conv);
  } catch (error) {
    console.error("Conversations POST Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
