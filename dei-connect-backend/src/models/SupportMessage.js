import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";

const supportMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: String, enum: ["user", "support"], required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

toJSONPlugin(supportMessageSchema, {
  afterTransform(_doc, ret) {
    delete ret.user;
    ret.time = ret.createdAt;
    delete ret.createdAt;
  },
});

export default mongoose.model("SupportMessage", supportMessageSchema);
