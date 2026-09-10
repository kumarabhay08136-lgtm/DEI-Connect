import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Post from "../models/Post.js";
import { formatFileSize } from "../utils/format.js";
import { storeUploadedFile, deleteStoredFile } from "../utils/storage.js";
import notify from "../utils/notify.js";

// GET /api/posts
export const getPosts = asyncHandler(async (_req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts.map((p) => p.toJSON()));
});

// GET /api/posts?authorId=... — also usable as GET /api/users/:id/posts
export const getPostsByAuthor = asyncHandler(async (req, res) => {
  const authorId = req.params.authorId || req.query.authorId;
  const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 });
  res.json(posts.map((p) => p.toJSON()));
});

// POST /api/posts  (multipart: content, image?, file?)
export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const imageFile = req.files?.image?.[0];
  const docFile = req.files?.file?.[0];

  if (!content?.trim() && !imageFile && !docFile) {
    throw new AppError("A post needs some text, an image, or a document.", 400);
  }

  const isFaculty = req.user.role === "Faculty";

  const post = await Post.create({
    author: req.user._id,
    content: content?.trim() || "",
    image: imageFile ? await storeUploadedFile(req, imageFile, "posts") : null,
    file: docFile
      ? {
          name: docFile.originalname,
          url: await storeUploadedFile(req, docFile, "posts"),
          size: formatFileSize(docFile.size),
        }
      : undefined,
    official: isFaculty,
    verified: isFaculty,
  });


  res.status(201).json(post.toJSON());
});

// POST /api/posts/:id/like  (toggle)
export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError("Post not found.", 404);

  const alreadyLiked = post.likedBy.some((id) => id.equals(req.user._id));
  if (alreadyLiked) {
    post.likedBy.pull(req.user._id);
  } else {
    post.likedBy.push(req.user._id);
    await notify({
      userId: post.author,
      type: "like",
      actorId: req.user._id,
      message: `${req.user.name} liked your post.`,
    });
  }

  await post.save();
  res.json(post.toJSON());
});

// POST /api/posts/:id/comments  { text }
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw new AppError("Comment text is required.", 400);

  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError("Post not found.", 404);

  post.comments.push({ author: req.user._id, text: text.trim() });
  await post.save();

  await notify({
    userId: post.author,
    type: "comment",
    actorId: req.user._id,
    message: `${req.user.name} commented on your post.`,
  });

  res.status(201).json(post.toJSON());
});

// DELETE /api/posts/:id — only the author may delete their own post.
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError("Post not found.", 404);
  if (!post.author.equals(req.user._id)) {
    throw new AppError("You can only delete your own posts.", 403);
  }
  deleteStoredFile(post.image);
  deleteStoredFile(post.file?.url);
  await post.deleteOne();
  res.status(204).send();
});
