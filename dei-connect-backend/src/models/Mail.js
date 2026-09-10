import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";

const mailSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
    threadId: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

mailSchema.index({ to: 1, createdAt: -1 });
mailSchema.index({ from: 1, createdAt: -1 });

toJSONPlugin(mailSchema, {
  afterTransform(_doc, ret) {
    ret.fromId = ret.from?.toString();
    ret.toId = ret.to?.toString();
    delete ret.from;
    delete ret.to;
    ret.time = ret.createdAt;
    delete ret.createdAt;
  },
});

export default mongoose.model("Mail", mailSchema);
