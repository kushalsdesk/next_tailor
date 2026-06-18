import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { Admission, Inquiry, User, Conversation } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDB();

    // Pending applications (admissions and inquiries with status 'submitted')
    const pendingAdmissionsCount = await Admission.countDocuments({ status: "submitted" });
    const pendingInquiriesCount = await Inquiry.countDocuments({ status: "submitted" });
    const totalPendingApplications = pendingAdmissionsCount + pendingInquiriesCount;

    // Total users (excluding the admin)
    const totalUsersCount = await User.countDocuments({ role: "user" });

    // Unread queries (Conversations where the last message was from a user)
    const unreadQueriesCount = await Conversation.countDocuments({ from: "user" }); 

    return NextResponse.json({
      success: true,
      stats: {
        pendingApplications: totalPendingApplications,
        unreadQueries: unreadQueriesCount,
        totalUsers: totalUsersCount,
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
