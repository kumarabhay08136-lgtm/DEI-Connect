import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Mail from "../models/Mail.js";
import notify from "../utils/notify.js";

// GET /api/messages?folder=inbox|sent
export const getMessages = asyncHandler(async (req, res) => {
  const folder = req.query.folder === "sent" ? "sent" : "inbox";
  const filter = folder === "sent" ? { from: req.user._id } : { to: req.user._id };

  const mail = await Mail.find(filter).sort({ createdAt: -1 });
  res.json(mail.map((m) => ({ ...m.toJSON(), folder })));
});

// POST /api/messages  { toId, subject, body, threadId? }
export const sendMessage = asyncHandler(async (req, res) => {
  const { toId, subject, body, threadId } = req.body;
  if (!toId || !subject?.trim() || !body?.trim()) {
    throw new AppError("Recipient, subject and body are all required.", 400);
  }

  const mail = await Mail.create({
    from: req.user._id,
    to: toId,
    subject: subject.trim(),
    body: body.trim(),
    read: false,
    threadId: threadId || null,
  });

  await notify({
    userId: toId,
    type: "message",
    actorId: req.user._id,
    message: `New message: "${subject.trim()}"`,
  });


  res.status(201).json({ ...mail.toJSON(), folder: "sent" });
});

// PATCH /api/messages/:id/read
export const markMessageRead = asyncHandler(async (req, res) => {
  const mail = await Mail.findOneAndUpdate(
    { _id: req.params.id, to: req.user._id },
    { read: true },
    { new: true }
  );
  if (!mail) throw new AppError("Message not found.", 404);
  res.json(mail.toJSON());
});
