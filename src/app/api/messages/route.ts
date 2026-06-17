import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { Message, Conversation } from "@/lib/models";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Messages GET Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { conversationId, sender, text, context } = await req.json();

    if (!conversationId || !sender || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Save the new message
    const newMsg = await Message.create({ conversationId, sender, text });
    
    // 2. Update the parent conversation's lastMessage and timestamp
    const updateData: any = { lastMessage: text, updatedAt: new Date() };
    if (context) updateData.context = context; // allow updating context

    await Conversation.findByIdAndUpdate(conversationId, updateData);

    return NextResponse.json(newMsg);
  } catch (error) {
    console.error("Messages POST Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
