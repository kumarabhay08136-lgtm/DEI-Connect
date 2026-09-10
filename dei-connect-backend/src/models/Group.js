import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";
import { GROUP_CATEGORIES } from "../utils/constants.js";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    category: { type: String, enum: GROUP_CATEGORIES, required: true },
    tags: [{ type: String, trim: true }],
    image: { type: String, default: null },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

groupSchema.index({ name: "text", category: 1 });

toJSONPlugin(groupSchema, {
  afterTransform(_doc, ret) {
    ret.creatorId = ret.creator?.toString();
    delete ret.creator;
    ret.members = (ret.members || []).map((id) => id.toString());
  },
});

export default mongoose.model("Group", groupSchema);
