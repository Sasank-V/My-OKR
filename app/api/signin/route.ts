import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // ensure DB connection

    const body = await req.json();
    const {
      name,
      email,
      role,
      organizationId,
      departmentId,
      teamId,
      avatar,
      access_token,
      refresh_token,
    } = body;

    if (!email || !role || !access_token || !refresh_token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { message: "User already exists", user },
        { status: 200 }
      );
    }

    user = await User.create({
      name,
      email,
      role,
      organizationId,
      departmentId,
      teamId,
      avatar,
      access_token,
      refresh_token,
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
