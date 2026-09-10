import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";
import { NOTIFICATION_TYPES } from "../utils/constants.js";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true, maxlength: 300 },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ user: 1, createdAt: -1 });

toJSONPlugin(notificationSchema, {
  afterTransform(_doc, ret) {
    delete ret.user;
    ret.actorId = ret.actor?.toString();
    delete ret.actor;
    ret.time = ret.createdAt;
    delete ret.createdAt;
  },
});

export default mongoose.model("Notification", notificationSchema);
