import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import notify from "../utils/notify.js";

// GET /api/users — the Feed page's "discover people" directory.
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, q } = req.query;
  const filter = {};
  if (role && role !== "All") filter.role = role;
  if (q) filter.name = { $regex: q, $options: "i" };

  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json(users.map((u) => u.toPublicJSON()));
});

// GET /api/users/:id — a single public profile (full about/education/skills/
// cover photo, subject to that user's own privacy setting). This is what
// powers "view someone else's profile" from the Feed, a post author's name,
// a search result, etc.
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found.", 404);

  const isConnection = Boolean(
    await Follow.exists({
      $or: [
        { follower: req.user._id, following: user._id },
        { follower: user._id, following: req.user._id },
      ],
    })
  );

  res.json(user.toPublicJSON({ isConnection }));
});

// GET /api/users/me/following — ids the current user follows.
export const getFollowing = asyncHandler(async (req, res) => {
  const follows = await Follow.find({ follower: req.user._id }).select("following");
  res.json(follows.map((f) => f.following.toString()));
});

// POST /api/users/:id/follow
export const followUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  if (targetId === req.user.id) throw new AppError("You can't follow yourself.", 400);

  const target = await User.findById(targetId);
  if (!target) throw new AppError("User not found.", 404);

  await Follow.updateOne(
    { follower: req.user._id, following: targetId },
    { $setOnInsert: { follower: req.user._id, following: targetId } },
    { upsert: true }
  );

  await notify({
    userId: targetId,
    type: "follow",
    actorId: req.user._id,
    message: `${req.user.name} started following you.`,
  });

  const follows = await Follow.find({ follower: req.user._id }).select("following");
  res.json(follows.map((f) => f.following.toString()));
});

// DELETE /api/users/:id/follow
export const unfollowUser = asyncHandler(async (req, res) => {
  await Follow.deleteOne({ follower: req.user._id, following: req.params.id });
  const follows = await Follow.find({ follower: req.user._id }).select("following");
  res.json(follows.map((f) => f.following.toString()));
});
