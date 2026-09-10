import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import SupportMessage from "../models/SupportMessage.js";
import { SUPPORT_AUTO_REPLIES } from "../utils/constants.js";

// GET /api/support/messages
export const getHelpMessages = asyncHandler(async (req, res) => {
  const messages = await SupportMessage.find({ user: req.user._id }).sort({ createdAt: 1 });
  res.json(messages.map((m) => m.toJSON()));
});

// POST /api/support/messages  { text }
export const sendHelpMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw new AppError("Message text is required.", 400);

  await SupportMessage.create({ user: req.user._id, sender: "user", text: text.trim() });

  const reply = SUPPORT_AUTO_REPLIES[Math.floor(Math.random() * SUPPORT_AUTO_REPLIES.length)];
  await SupportMessage.create({ user: req.user._id, sender: "support", text: reply });

  const messages = await SupportMessage.find({ user: req.user._id }).sort({ createdAt: 1 });
  res.status(201).json(messages.map((m) => m.toJSON()));
});
