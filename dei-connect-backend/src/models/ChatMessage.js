import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";

const chatMessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true, maxlength: 2000, default: "" },
    attachment: {
      name: { type: String, default: null },
      url: { type: String, default: null },
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

toJSONPlugin(chatMessageSchema, {
  afterTransform(_doc, ret) {
    ret.conversationId = ret.conversation?.toString();
    ret.senderId = ret.sender?.toString();
    delete ret.conversation;
    delete ret.sender;
    ret.time = ret.createdAt;
    delete ret.createdAt;
    ret.attachment = ret.attachment?.url ? ret.attachment : null;
    ret.readBy = (ret.readBy || []).map((id) => id.toString());
  },
});

export default mongoose.model("ChatMessage", chatMessageSchema);
