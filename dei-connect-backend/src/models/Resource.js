import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";
import { RESOURCE_TYPES } from "../utils/constants.js";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    department: { type: String, required: true, trim: true },
    type: { type: String, enum: RESOURCE_TYPES, default: "doc" },
    fileUrl: { type: String, default: null },
    fileName: { type: String, default: null },
    size: { type: String, default: "—" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

resourceSchema.index({ title: "text", department: 1, type: 1 });

toJSONPlugin(resourceSchema, {
  afterTransform(_doc, ret) {
    ret.authorId = ret.author?.toString();
    delete ret.author;
    // The frontend's ResourceCard reads `resource.fileData` as the download
    // href — keep that exact field name so no UI change is needed.
    ret.fileData = ret.fileUrl;
    delete ret.fileUrl;
  },
});

export default mongoose.model("Resource", resourceSchema);
