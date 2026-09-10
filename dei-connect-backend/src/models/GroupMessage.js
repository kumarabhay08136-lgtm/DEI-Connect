import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";

const groupMessageSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

toJSONPlugin(groupMessageSchema, {
  afterTransform(_doc, ret) {
    ret.groupId = ret.group?.toString();
    ret.senderId = ret.sender?.toString();
    delete ret.group;
    delete ret.sender;
    ret.time = ret.createdAt;
    delete ret.createdAt;
  },
});

export default mongoose.model("GroupMessage", groupMessageSchema);
