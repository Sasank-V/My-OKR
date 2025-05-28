import { NextResponse } from "next/server";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const users = await User.find().lean();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
