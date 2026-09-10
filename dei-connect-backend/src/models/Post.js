import mongoose from "mongoose";
import toJSONPlugin from "../utils/toJSONPlugin.js";

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, _id: true }
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, trim: true, maxlength: 3000, default: "" },
    image: { type: String, default: null },
    file: {
      name: { type: String, default: null },
      url: { type: String, default: null },
      size: { type: String, default: null },
    },
    // Faculty announcements are auto-flagged official/verified at creation time.
    official: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

postSchema.index({ author: 1, createdAt: -1 });

toJSONPlugin(postSchema, {
  afterTransform(doc, ret) {
    ret.authorId = ret.author?.toString?.() ?? ret.author;
    delete ret.author;
    if (doc.populated("author") && doc.author?.toPublicJSON) {
      ret.author = doc.author.toPublicJSON();
      ret.authorId = ret.author.id;
    }

    ret.postedAt = ret.createdAt;
    delete ret.createdAt;

    ret.likedBy = (ret.likedBy || []).map((id) => id.toString());
    ret.file = ret.file?.url || ret.file?.name ? { name: ret.file.name, url: ret.file.url, size: ret.file.size } : null;

    ret.comments = (ret.comments || []).map((c) => ({
      id: c._id.toString(),
      authorId: c.author.toString(),
      text: c.text,
      time: new Date(c.createdAt).getTime(),
    }));
  },
});

export default mongoose.model("Post", postSchema);
