import { NextResponse } from "next/server";
import OKR from "@/models/okr";
import { connectDB } from "@/lib/mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "individual";

    const okrs = await OKR.find({ objectiveType: type });

    return NextResponse.json({ success: true, data: okrs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching OKRs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch OKRs" },
      { status: 500 }
    );
  }
}
