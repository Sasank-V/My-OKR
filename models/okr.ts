import mongoose, { Schema } from "mongoose";

export interface IKeyResult {
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOKR extends Document {
  title: string;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  memberId?: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  organizationId?: mongoose.Types.ObjectId;
  objectiveType: "individual" | "team" | "department" | "organization";
  status: "draft" | "active" | "completed" | "cancelled";
  progress: number;
  keyResults: IKeyResult[];
  tags: string[];
  startDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const KeyResultSchema = new Schema<IKeyResult>(
  {
    title: { type: String, required: true },
    description: String,
    target: Number,
    current: Number,
    unit: String,
    progress: Number,
  },
  { timestamps: true }
);

const OKRSchema = new Schema<IOKR>(
  {
    title: { type: String, required: true },
    description: String,
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }, 
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    objectiveType: {
      type: String,
      enum: ["individual", "team", "department", "organization"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed", "cancelled"],
      default: "draft",
    },
    progress: Number,
    keyResults: [KeyResultSchema],
    tags: [String],
    startDate: Date,
    dueDate: Date,
  },
  { timestamps: true }
);

const OKR = mongoose.models.OKR || mongoose.model<IOKR>("OKR", OKRSchema);
export default OKR;
