import Notification from "../models/Notification.js";

// Fire-and-forget notification creation. Never lets a notification
// failure break the primary action (follow, like, comment, etc.).
export default async function notify({ userId, type, actorId, message }) {
  if (String(userId) === String(actorId)) return; // don't notify yourself
  try {
    await Notification.create({ user: userId, type, actor: actorId, message });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
}
