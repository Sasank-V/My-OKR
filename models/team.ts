import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeam extends Document {
  departmentId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  leadId: mongoose.Types.ObjectId;
  memberIds: mongoose.Types.ObjectId[];
  goals?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema<ITeam> = new Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    goals: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Planning"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Team: Model<ITeam> =
  mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);

export default Team;
