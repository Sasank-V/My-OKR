import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import OKR from "@/models/okr";
import OKRUpdateLog from "@/models/okr-update-log";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authConfig);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const data = await req.json();
  const {
    title,
    description,
    objectiveType,
    organizationId,
    teamId,
    departmentId,
    status,
    progress,
    keyResults,
    tags,
    startDate,
    dueDate,
  } = data;

  // Role-based objectiveType check
  const role = user.role;
  const allowedTypes: Record<typeof role, string[]> = {
    admin: ["individual", "team", "department", "organization"],
    "dept-manager": ["individual", "team", "department"],
    "team-manager": ["individual", "team"],
    member: ["individual"],
  };

  if (!allowedTypes[role].includes(objectiveType)) {
    return NextResponse.json(
      {
        error: `Role '${role}' cannot create objective type '${objectiveType}'`,
      },
      { status: 403 }
    );
  }

  try {
    const newOKR = await OKR.create({
      title,
      description,
      ownerId: user._id,
      organizationId, 
      teamId, 
      departmentId,
      objectiveType,
      status,
      progress,
      keyResults,
      tags,
      startDate,
      dueDate,
    });

    await OKRUpdateLog.create({
      okrId: newOKR._id,
      userId: user._id,
      action: "create",
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, okr: newOKR }, { status: 201 });
  } catch (err) {
    console.error("Error creating OKR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
