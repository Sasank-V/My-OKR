import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Team from "@/models/team";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const teamId = params.id;

  try {
    const team = await Team.findById(teamId)
      .populate("departmentId", "name")
      .populate("organizationId", "name")
      .populate("leadId", "name email avatar")
      .populate("memberIds", "name email avatar")
      .lean();

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("GET /teams/:id error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const teamId = params.id;

  try {
    const data = await req.json();

    const updatedTeam = await Team.findByIdAndUpdate(teamId, data, {
      new: true,
      runValidators: true,
    })
      .populate("departmentId", "name")
      .populate("organizationId", "name")
      .populate("leadId", "name email avatar")
      .populate("memberIds", "name email avatar");

    if (!updatedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error("PUT /teams/:id error:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const teamId = params.id;

  try {
    const deletedTeam = await Team.findByIdAndDelete(teamId);

    if (!deletedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("DELETE /teams/:id error:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
