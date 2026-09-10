import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { storeUploadedFile, deleteStoredFile } from "../utils/storage.js";

// Shape the frontend's profileService already expects back.
function toProfileShape(user) {
  return {
    tagline: user.tagline || "",
    about: user.about || "",
    education: user.education || {},
    skills: user.skills || [],
  };
}

// GET /api/profile/me
export const getProfile = asyncHandler(async (req, res) => {
  res.json(toProfileShape(req.user));
});

// PATCH /api/profile/me
// Accepts any of: name, tagline, about, education{institution,degree,years}, skills[]
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, tagline, about, education, skills } = req.body;

  if (name !== undefined) req.user.name = name;
  if (tagline !== undefined) req.user.tagline = tagline;
  if (about !== undefined) req.user.about = about;
  if (education !== undefined) req.user.education = { ...req.user.education, ...education };
  if (skills !== undefined) {
    req.user.skills = Array.isArray(skills)
      ? skills
      : String(skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
  }

  await req.user.save();

  res.json(toProfileShape(req.user));
});

// POST /api/profile/me/avatar  (multipart field "avatar")
export const uploadAvatarPhoto = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image file was uploaded." });

  const oldUrl = req.user.avatarUrl;
  req.user.avatarUrl = await storeUploadedFile(req, req.file, "avatars");
  await req.user.save();
  deleteStoredFile(oldUrl);

  res.json({ avatarUrl: req.user.avatarUrl });
});

// DELETE /api/profile/me/avatar
export const removeAvatarPhoto = asyncHandler(async (req, res) => {
  deleteStoredFile(req.user.avatarUrl);
  req.user.avatarUrl = null;
  await req.user.save();

  res.json({ avatarUrl: null });
});

// POST /api/profile/me/cover  (multipart field "cover")
export const uploadCoverPhoto = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image file was uploaded." });

  const oldUrl = req.user.coverUrl;
  req.user.coverUrl = await storeUploadedFile(req, req.file, "covers");
  await req.user.save();
  deleteStoredFile(oldUrl);

  res.json({ coverUrl: req.user.coverUrl });
});

// DELETE /api/profile/me/cover
export const removeCoverPhoto = asyncHandler(async (req, res) => {
  deleteStoredFile(req.user.coverUrl);
  req.user.coverUrl = null;
  await req.user.save();

  res.json({ coverUrl: null });
});
