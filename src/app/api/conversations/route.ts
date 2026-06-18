import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { Conversation } from "@/lib/models";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const type = url.searchParams.get("type");


    // 1. Fetch exact conversation for a USER
    if (userId && type) {
      const conv = await Conversation.findOne({ userId, type });
      
      // Do NOT auto-create here. Just return the conversation or null.
      if (!conv) {
        return NextResponse.json(null);
      }
      return NextResponse.json(conv);
    } 
    
    // 2. Fetch ALL conversations of a type for ADMIN
    if (type) {
      // We will also join with User collection to get displayName and photo
      const convos = await Conversation.aggregate([
        { $match: { type } },
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
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    console.error("Conversations API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    if (!body.userId || !body.type || !body.context) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conv = await Conversation.create({
      userId: body.userId,
      type: body.type,
      context: body.context,
      lastMessage: "",
      from: "user"
    });

    return NextResponse.json(conv);
  } catch (error) {
    console.error("Conversations POST Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
