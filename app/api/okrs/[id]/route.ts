import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import OKR from "@/models/okr";
import OKRUpdateLog from "@/models/okr-update-log";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import User from "@/models/user";

// Import all referenced models to ensure they're registered
import "@/models/team"; // Make sure Team model is imported
import "@/models/department"; // Make sure Department model is imported
import "@/models/organisation"; // Make sure Organization model is imported

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const params = await context.params;
  const okrId = params.id;

  try {
    const okr = await OKR.findById(okrId)
      .populate("ownerId", "name email")
      .populate("memberId", "name email", undefined, { strictPopulate: false })
      .populate("teamId", "name")
      .populate("departmentId", "name")
      .populate("organizationId", "name")
      .lean();

    if (!okr) {
      return NextResponse.json({ error: "OKR not found" }, { status: 404 });
    }

    return NextResponse.json(okr);
  } catch (error) {
    console.error("GET /api/okrs/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Helper function to sanitize ObjectId fields
function sanitizeObjectIdField(value: any): any {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string" && mongoose.Types.ObjectId.isValid(value)) {
    return value;
  }
  if (mongoose.Types.ObjectId.isValid(value)) {
    return value;
  }
  return null;
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const okrId = params.id;
  await connectDB();

  // Get session
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized: No user session found" },
      { status: 401 }
    );
  }

  // Find user by email from session
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized: User not found" },
      { status: 401 }
    );
  }

  const userId = user._id.toString();

  try {
    const data = await req.json();

    const okr = await OKR.findById(okrId);
    if (!okr) {
      return NextResponse.json({ error: "OKR not found" }, { status: 404 });
    }

    // Prepare array to log changes
    const logs: any[] = [];

    // Fields to compare - remove memberId from here
    const fieldsToCompare = [
      "title",
      "description",
      "ownerId", // we will override this with userId from session below
      // "memberId",  <-- removed
      "teamId",
      "departmentId",
      "organizationId",
      "objectiveType",
      "status",
      "progress",
      "tags",
      "startDate",
      "dueDate",
    ];

    // ObjectId fields that need sanitization - remove memberId here also
    const objectIdFields = [
      "ownerId",
      // "memberId",  <-- removed
      "teamId",
      "departmentId",
      "organizationId",
    ];

    for (const field of fieldsToCompare) {
      let oldValue = okr.get(field);
      let newValue = data[field];

      // For ownerId, always override with userId from session (ignore incoming data)
      if (field === "ownerId") {
        newValue = userId;
      }

      // Sanitize ObjectId fields
      if (objectIdFields.includes(field)) {
        newValue = sanitizeObjectIdField(newValue);
      }

      // For ObjectIds convert to string for comparison
      const oldStr = oldValue?.toString?.() ?? oldValue;
      const newStr = newValue?.toString?.() ?? newValue;

      if (newValue !== undefined && oldStr !== newStr) {
        logs.push(
          new OKRUpdateLog({
            okrId: okr._id,
            userId: userId,
            action: "update",
            fieldChanged: field,
            oldValue: oldValue,
            newValue: newValue,
          })
        );
        okr.set(field, newValue);
      }
    }

    // Handle keyResults array updates if provided
    if (Array.isArray(data.keyResults)) {
      data.keyResults.forEach((newKR: any, index: number) => {
        const oldKR = okr.keyResults[index];
        if (!oldKR) {
          logs.push(
            new OKRUpdateLog({
              okrId: okr._id,
              keyResultId: null,
              userId,
              action: "create",
              fieldChanged: `keyResults[${index}]`,
              oldValue: null,
              newValue: JSON.stringify(newKR),
            })
          );
        } else {
          const krFields = [
            "title",
            "description",
            "target",
            "current",
            "unit",
            "progress",
          ];
          krFields.forEach((krField) => {
            const oldVal = oldKR[krField];
            const newVal = newKR[krField];
            if (newVal !== undefined && oldVal !== newVal) {
              logs.push(
                new OKRUpdateLog({
                  okrId: okr._id,
                  keyResultId: oldKR._id,
                  userId,
                  action: krField === "progress" ? "progress_update" : "update",
                  fieldChanged: `keyResults.${krField}`,
                  oldValue: oldVal,
                  newValue: newVal,
                })
              );
              oldKR[krField] = newVal;
            }
          });
        }
      });

      if (okr.keyResults.length > data.keyResults.length) {
        for (let i = data.keyResults.length; i < okr.keyResults.length; i++) {
          logs.push(
            new OKRUpdateLog({
              okrId: okr._id,
              keyResultId: okr.keyResults[i]._id,
              userId,
              action: "delete",
              fieldChanged: `keyResults[${i}]`,
              oldValue: JSON.stringify(okr.keyResults[i]),
              newValue: null,
            })
          );
        }
        okr.keyResults.splice(data.keyResults.length);
      }
    }

    await okr.save();

    if (logs.length > 0) {
      await OKRUpdateLog.insertMany(logs);
    }

    return NextResponse.json(okr);
  } catch (error) {
    console.error("PUT /api/okr/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update OKR" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const okrId = params.id;
  await connectDB();

  try {
    const userId = req.headers.get("x-user-id");
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing user ID in request headers" },
        { status: 401 }
      );
    }

    const deletedOKR = await OKR.findByIdAndDelete(okrId);

    if (!deletedOKR) {
      return NextResponse.json({ error: "OKR not found" }, { status: 404 });
    }

    // Log the deletion
    await OKRUpdateLog.create({
      okrId: deletedOKR._id,
      userId,
      action: "delete",
      timestamp: new Date(),
    });

    return NextResponse.json({ message: "OKR deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/okr/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete OKR" },
      { status: 500 }
    );
  }
}
