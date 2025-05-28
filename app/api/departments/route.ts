// app/api/departments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Department from "@/models/department";
import User from "@/models/user";
import Team from "@/models/team";
import Okr from "@/models/okr";

export async function GET(req: Request) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    // Fetch all departments with the head populated
    const departments = await Department.find().populate(
      "head",
      "name email role"
    );

    const result = await Promise.all(
      departments.map(async (dept) => {
        const teamCount = await Team.countDocuments({ departmentId: dept._id });
        const memberCount = await User.countDocuments({
          departmentId: dept._id,
        });
        const okrCount = await Okr.countDocuments({ departmentId: dept._id });

        return {
          _id: dept._id.toString(),
          name: dept.name,
          description: dept.description,
          status: dept.status,
          head: {
            _id: dept.head._id.toString(),
            name: dept.head.name,
            email: dept.head.email,
            role: dept.head.role,
          },
          teamCount,
          memberCount,
          okrCount,
        };
      })
    );

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
