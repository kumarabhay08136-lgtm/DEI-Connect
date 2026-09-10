import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const VALID_SECTIONS = ["notifications", "privacy", "appearance", "security"];

// GET /api/settings
export const getSettings = asyncHandler(async (req, res) => {
  res.json(req.user.settings);
});

// PATCH /api/settings/:section  (partial update within that section)
export const updateSettingsSection = asyncHandler(async (req, res) => {
  const { section } = req.params;
  if (!VALID_SECTIONS.includes(section)) {
    throw new AppError(`Unknown settings section "${section}".`, 400);
  }

  req.user.settings[section] = { ...req.user.settings[section], ...req.body };
  req.user.markModified("settings");
  await req.user.save();

  res.json(req.user.settings);
});
