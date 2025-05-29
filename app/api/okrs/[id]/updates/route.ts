import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose"; // adjust path if needed
import OKRUpdateLog from "@/models/okr-update-log"; // adjust path if needed

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid OKR ID" }, { status: 400 });
  }

  try {
    await connectDB();

    const logs = await OKRUpdateLog.find({ okrId: id })
      .sort({ timestamp: -1 }) // latest updates first
      .populate("userId", "name email") // populate user details (name and email fields assumed)
      .populate("keyResultId") // optional: populate keyResult if needed
      .lean();

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/okrs/[id]/updates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch OKR update logs" },
      { status: 500 }
    );
  }
}
