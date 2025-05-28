import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOKRUpdateLog extends Document {
  okrId: mongoose.Types.ObjectId;
  keyResultId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: "create" | "update" | "delete" | "progress_update";
  fieldChanged?: string;
  oldValue?: string | number | null;
  newValue?: string | number | null;
  timestamp: Date;
}

const OKRUpdateLogSchema: Schema<IOKRUpdateLog> = new Schema({
  okrId: { type: mongoose.Schema.Types.ObjectId, ref: "OKR", required: true },
  keyResultId: { type: mongoose.Schema.Types.ObjectId, ref: "OKR.keyResults" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: {
    type: String,
    enum: ["create", "update", "delete", "progress_update"],
    required: true,
  },
  fieldChanged: String,
  oldValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

const OKRUpdateLog: Model<IOKRUpdateLog> =
  mongoose.models.OKRUpdateLog ||
  mongoose.model<IOKRUpdateLog>("OKRUpdateLog", OKRUpdateLogSchema);
export default OKRUpdateLog;
