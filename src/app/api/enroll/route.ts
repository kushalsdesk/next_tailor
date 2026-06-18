import connectToDB from "@/lib/mongoose";
import { Admission } from "@/lib/models";

export async function GET() {
  return Response.json({ success: true });
}

export async function POST(req: Request) {
  const formData = await req.json();
  const { firstName, lastName, course, pincode, phone, email, userId } = formData;

  try {
    await connectToDB();
    const app = new Admission({
      userId,
      name: `${firstName || ""} ${lastName || ""}`.trim(),
      course,
      phone,
      zipcode: pincode,
      email,
      status: "submitted",
    });
    await app.save();

    return Response.json({ success: true, application: app });
  } catch (error) {
    console.error("Error Saving Application:", error);
    return Response.json(
      { error: (error as Error).message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}

