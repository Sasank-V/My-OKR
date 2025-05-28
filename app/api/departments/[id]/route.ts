// /app/api/departments/[id]/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose"; // Ensure this connects to MongoDB
import Department from "@/models/department";
import Team from "@/models/team";
import OKR from "@/models/okr";
// import User from "@/models/user";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const departmentId = params.id;

  try {
    const department = await Department.findById(departmentId)
      .populate("head", "name email avatar role") // populate head details
      .lean();

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const teams = await Team.find({ departmentId })
      .populate("leadId", "name")
      .lean();

    const okrs = await OKR.find({ departmentId }).lean();

    return NextResponse.json({
      ...department,
      teams,
      okrs,
    });
  } catch (error) {
    console.error(error);
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
  const departmentId = params.id;

  try {
    const data = await req.json();

    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      { ...data },
      { new: true, runValidators: true }
    ).populate("head", "name email avatar role");

    if (!updatedDepartment) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error("PUT /departments/:id error:", error);
    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const departmentId = params.id;

  try {
    const deletedDepartment = await Department.findByIdAndDelete(departmentId);

    if (!deletedDepartment) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("DELETE /departments/:id error:", error);
    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 }
    );
  }
}
