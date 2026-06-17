import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { User } from "@/lib/models";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    if (!body.uid || !body.email) {
      return NextResponse.json({ error: "Missing uid or email" }, { status: 400 });
    }

    // Upsert user
    const user = await User.findOneAndUpdate(
      { uid: body.uid },
      { 
        email: body.email, 
        displayName: body.displayName, 
        photoURL: body.photoURL,
        lastSeen: new Date()
      },
      { returnDocument: 'after', upsert: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("User API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
