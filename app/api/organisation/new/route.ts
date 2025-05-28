import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import Organization from "@/models/organisation";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authConfig);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the logged-in user from their email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Organization name is required." },
        { status: 400 }
      );
    }

    const newOrganization = new Organization({
      name,
      description,
      admins: [new mongoose.Types.ObjectId(user._id)],
    });

    await newOrganization.save();

    return NextResponse.json(newOrganization, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
