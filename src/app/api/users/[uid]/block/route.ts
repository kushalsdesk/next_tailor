import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { User, Conversation, Message } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { uid: string } }) {
  try {
    await connectToDB();
    const { uid } = params;
    const body = await req.json();
    const { action } = body; // "block" or "unblock"

    if (!uid || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (action === "block") {
      // 1. Set user to blocked
      const user = await User.findOneAndUpdate({ uid }, { isBlocked: true }, { returnDocument: 'after' });
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // 2. Find conversation and delete messages
      const conversation = await Conversation.findOne({ userId: uid });
      if (conversation) {
        await Message.deleteMany({ conversationId: conversation._id });
        await Conversation.deleteOne({ _id: conversation._id });
      }

      return NextResponse.json({ success: true, message: "User blocked successfully", user });
    } else if (action === "unblock") {
      // Unblock user
      const user = await User.findOneAndUpdate({ uid }, { isBlocked: false }, { returnDocument: 'after' });
      return NextResponse.json({ success: true, message: "User unblocked successfully", user });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Block API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
