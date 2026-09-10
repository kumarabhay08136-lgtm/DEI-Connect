import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Notification from "../models/Notification.js";

// GET /api/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications.map((n) => n.toJSON()));
});

// PATCH /api/notifications/:id/read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) throw new AppError("Notification not found.", 404);

  const all = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(all.map((n) => n.toJSON()));
});

// PATCH /api/notifications/read-all
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  const all = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(all.map((n) => n.toJSON()));
});
