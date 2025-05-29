import mongoose, { Schema, Document, Model } from "mongoose";
export interface IDepartment extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  head: mongoose.Types.ObjectId;
  budget?: string;
  location?: string;
  establishedDate?: Date;
  mission?: string;
  vision?: string;
  status: "Active" | "Inactive" | "Planning" | "Restructuring";
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema: Schema<IDepartment> = new Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },

    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    budget: { type: String },
    location: { type: String },
    establishedDate: { type: Date },
    mission: { type: String },
    vision: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Planning", "Restructuring"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Department: Model<IDepartment> =
  mongoose.models.Department ||
  mongoose.model<IDepartment>("Department", DepartmentSchema);

export default Department;
