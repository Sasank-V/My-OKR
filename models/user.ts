import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "admin" | "dept-manager" | "team-manager" | "member";
  organizationId?: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  avatar?: string;
  access_token: string;
  refresh_token: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "dept-manager", "team-manager", "member"],
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    avatar: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
  },
  { timestamps: true }
);

// Handle hot-reloading models in dev
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
