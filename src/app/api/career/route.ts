import connectToDB from "@/lib/mongoose";
import { Inquiry } from "@/lib/models";

export async function GET() {
  return Response.json({ success: true });
}

export async function POST(req: Request) {
  const formData = await req.json();
  const {
    name,
    phone,
    email,
    careerOption,
    subscribe,
    getTips,
    sellCreation,
    loanFacility,
    userId,
  } = formData;

  try {
    await connectToDB();
    const app = new Inquiry({
      userId,
      name,
      phone,
      email,
      path: careerOption, // Map careerOption to path for the schema
      status: "submitted",
      subscribe,
      getTips,
      sellCreation,
      loanFacility,
    });
    await app.save();

    return Response.json({ success: true, application: app });
  } catch (error) {
    console.error("Error Saving Career Application:", error);
    return Response.json(
      { error: (error as Error).message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
