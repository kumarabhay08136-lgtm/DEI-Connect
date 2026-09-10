import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Exactly one conversation per pair of participants.
conversationSchema.index({ participants: 1 });

toJSONPlugin(conversationSchema, {
  timeFields: ["lastMessageAt"],
  afterTransform(_doc, ret) {
    ret.participantIds = (ret.participants || []).map((id) => id.toString());
    delete ret.participants;
  },
});

export default mongoose.model("Conversation", conversationSchema);
