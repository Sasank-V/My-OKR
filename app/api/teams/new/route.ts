import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Team from "@/models/team"; // Adjust path if needed
import Organization from "@/models/organisation"; // Import Organization model
import { connectDB } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      name,
      description,
      departmentId,
      // organizationId, -- remove from destructuring
      leadId,
      memberIds,
      goals,
      status,
    } = body;

    if (!name || !departmentId || !leadId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the first organization from DB
    const firstOrganization = await Organization.findOne().exec();
    if (!firstOrganization) {
      return NextResponse.json(
        { message: "No organization found in database" },
        { status: 400 }
      );
    }

    const newTeam = new Team({
      name,
      description,
      departmentId: new mongoose.Types.ObjectId(departmentId),
      organizationId: firstOrganization._id, // Use fetched organization id here
      leadId: new mongoose.Types.ObjectId(leadId),
      memberIds: Array.isArray(memberIds)
        ? memberIds.map((id: string) => new mongoose.Types.ObjectId(id))
        : [],
      goals,
      status,
    });

    await newTeam.save();

    return NextResponse.json(
      { message: "Team created successfully", team: newTeam },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create team:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
