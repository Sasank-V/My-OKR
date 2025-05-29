import { type NextRequest, NextResponse } from "next/server";
import Team from "@/models/team"; // Adjust the path to your Team model
import { connectDB } from "@/lib/mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");

    // Build the filter object conditionally
    const filter: any = {};
    if (departmentId) filter.departmentId = departmentId;

    // Fetch teams from MongoDB and populate lead and members info
    const teams = await Team.find(filter)
      .populate("leadId", "name avatar")
      .populate("memberIds", "name avatar")
      .lean();

    const teamsWithMembers = teams.map((team) => ({
      id: team._id.toString(),
      name: team.name,
      description: team.description,
      departmentId: team.departmentId.toString(),
      lead: team.leadId,
      members: team.memberIds,
      memberCount: team.memberIds.length,
      status: "Active",
    }));

    return NextResponse.json({ success: true, data: teamsWithMembers });
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
