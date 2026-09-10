import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";
import { COMMUNITY_CATEGORIES } from "../utils/constants.js";

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    category: { type: String, enum: COMMUNITY_CATEGORIES, required: true },
    banner: { type: String, default: null },
    icon: { type: String, default: null },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

communitySchema.index({ name: "text", category: 1 });

toJSONPlugin(communitySchema, {
  afterTransform(_doc, ret) {
    ret.creatorId = ret.creator?.toString();
    delete ret.creator;
    ret.members = (ret.members || []).map((id) => id.toString());
  },
});

export default mongoose.model("Community", communitySchema);
