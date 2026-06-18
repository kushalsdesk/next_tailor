import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { Admission, Inquiry, User, Conversation } from "@/lib/models";

export const dynamic = "force-dynamic";

interface AggregationResult {
  _id: { year: number; month: number };
  count: number;
}

export async function GET() {
  try {
    await connectToDB();

    const pendingAdmissionsCount = await Admission.countDocuments({ status: "submitted" });
    const pendingInquiriesCount = await Inquiry.countDocuments({ status: "submitted" });
    const totalPendingApplications = pendingAdmissionsCount + pendingInquiriesCount;

    const totalUsersCount = await User.countDocuments({ role: "user" });
    const unreadQueriesCount = await Conversation.countDocuments({ from: "user" }); 

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const usersByMonth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, role: "user" } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }
    ]);

    const admissionsByMonth = await Admission.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }
    ]);

    const inquiriesByMonth = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const graphData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      
      const uCount = usersByMonth.find((u: AggregationResult) => u._id.month === m && u._id.year === y)?.count || 0;
      const aCount = admissionsByMonth.find((a: AggregationResult) => a._id.month === m && a._id.year === y)?.count || 0;
      const iCount = inquiriesByMonth.find((inq: AggregationResult) => inq._id.month === m && inq._id.year === y)?.count || 0;

      graphData.push({
        name: monthNames[m - 1],
        users: uCount,
        applications: aCount + iCount,
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        pendingApplications: totalPendingApplications,
        unreadQueries: unreadQueriesCount,
        totalUsers: totalUsersCount,
      },
      graphData
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
