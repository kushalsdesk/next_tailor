import { AdminEmailTemplate } from "@/components/templates/admin.career.template";
import { UserEmailTemplate } from "@/components/templates/user.career.template";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
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
    message,
    subscribe,
    getTips,
    sellCreation,
    loanFacility,
  } = formData;

  try {
    const userResponse = await resend.emails.send({
      from: "ASHAA Institute <admin@emails.ashaafoundation.in>",
      to: [email],
      subject: "Contact Form Submission Confirmation",
      react: UserEmailTemplate({
        name,
        careerOption,
        subscribe,
        getTips,
        sellCreation,
        loanFacility,
      }),
    });

    if (userResponse.error) {
      console.error("User Email Error:", userResponse.error);
      return Response.json({ userError: userResponse.error }, { status: 500 });
    }

    const adminResponse = await resend.emails.send({
      from: "ASHAA Institute <admin@emails.ashaafoundation.in>",
      to: ["ashaafoundation25@gmail.com"],
      subject: "New Contact Notification",
      react: AdminEmailTemplate({
        name,
        phone,
        email,
        careerOption,
        message,
        subscribe,
        getTips,
        sellCreation,
        loanFacility,
      }),
    });

    if (adminResponse.error) {
      console.error("Admin Email Error:", adminResponse.error);
      return Response.json(
        { adminError: adminResponse.error },
        { status: 500 },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error Sending Emails:", error);
    return Response.json(
      { error: (error as Error).message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
