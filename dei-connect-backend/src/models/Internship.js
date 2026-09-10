import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    organization: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    skills: [{ type: String, trim: true }],
    duration: { type: String, default: "" },
    location: { type: String, default: "" },
    remote: { type: Boolean, default: false },
    eligibility: { type: String, default: "" },
    applyDetails: { type: String, default: "" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

internshipSchema.index({ title: "text", remote: 1 });

toJSONPlugin(internshipSchema, {
  afterTransform(_doc, ret) {
    ret.postedBy = ret.postedBy?.toString();
    ret.postedAt = ret.createdAt;
    delete ret.createdAt;
    ret.applicants = (ret.applicants || []).map((id) => id.toString());
  },
});

export default mongoose.model("Internship", internshipSchema);
