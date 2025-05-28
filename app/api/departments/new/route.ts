import { NextRequest, NextResponse } from "next/server";
import Department from "@/models/department";
import Organization from "@/models/organisation";
import { connectDB } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();

    const {
      name,
      description,
      head,
      budget,
      location,
      establishedDate,
      mission,
      vision,
      status,
    } = data;

    if (!name || !head) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const firstOrg = await Organization.findOne().sort({ createdAt: 1 });

    if (!firstOrg) {
      return NextResponse.json(
        { error: "No organisation found in the database." },
        { status: 404 }
      );
    }

    const newDepartment = await Department.create({
      organizationId: firstOrg._id,
      name,
      description,
      head,
      budget,
      location,
      establishedDate,
      mission,
      vision,
      status,
    });

    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
