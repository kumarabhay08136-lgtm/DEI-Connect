import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Conversation from "../models/Conversation.js";
import ChatMessage from "../models/ChatMessage.js";
import User from "../models/User.js";
import { storeUploadedFile } from "../utils/storage.js";

async function assertParticipant(conversation, userId) {
  const isParticipant = conversation.participants.some((id) => id.equals(userId));
  if (!isParticipant) throw new AppError("You're not part of this conversation.", 403);
}

// GET /api/chat/conversations — one row per 1:1 thread the user is in,
// shaped to match ConversationList.jsx directly.
export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .sort({ lastMessageAt: -1 })
    .populate("participants", "name avatarUrl role department");

  const rows = await Promise.all(
    conversations.map(async (convo) => {
      const other = convo.participants.find((p) => !p._id.equals(req.user._id));
      const lastMessage = await ChatMessage.findOne({ conversation: convo._id }).sort({
        createdAt: -1,
      });
      const unread = await ChatMessage.countDocuments({
        conversation: convo._id,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id },
      });

      return {
        id: convo._id.toString(),
        isGroup: false,
        userId: other?._id?.toString() || null,
        name: other?.name || "Deleted user",
        avatarUrl: other?.avatarUrl || null,
        lastMessage: lastMessage?.text || "No messages yet.",
        time: lastMessage ? lastMessage.createdAt.getTime() : convo.createdAt.getTime(),
        unread,
      };
    })
  );

  res.json(rows);
});

// POST /api/chat/conversations  { userId } — finds or creates the 1:1 thread.
export const startConversation = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new AppError("userId is required.", 400);
  if (userId === req.user.id) throw new AppError("You can't message yourself.", 400);

  const other = await User.findById(userId);
  if (!other) throw new AppError("User not found.", 404);

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, userId], $size: 2 },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants: [req.user._id, userId] });
  }

  res.status(201).json(conversation.toJSON());
});

// GET /api/chat/conversations/:id/messages
export const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) throw new AppError("Conversation not found.", 404);
  await assertParticipant(conversation, req.user._id);

  const messages = await ChatMessage.find({ conversation: conversation._id }).sort({
    createdAt: 1,
  });

  // Mark everything sent by the other participant as read.
  await ChatMessage.updateMany(
    { conversation: conversation._id, sender: { $ne: req.user._id }, readBy: { $ne: req.user._id } },
    { $push: { readBy: req.user._id } }
  );

  res.json(
    messages.map((m) => ({ ...m.toJSON(), isOwn: m.sender.equals(req.user._id) }))
  );
});

// POST /api/chat/conversations/:id/messages  (multipart: text?, attachment?)
export const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) throw new AppError("Conversation not found.", 404);
  await assertParticipant(conversation, req.user._id);

  const { text } = req.body;
  if (!text?.trim() && !req.file) {
    throw new AppError("Message needs text or an attachment.", 400);
  }

  const message = await ChatMessage.create({
    conversation: conversation._id,
    sender: req.user._id,
    text: text?.trim() || "",
    attachment: req.file
      ? { name: req.file.originalname, url: await storeUploadedFile(req, req.file, "posts") }
      : undefined,
    readBy: [req.user._id],
  });

  conversation.lastMessageAt = new Date();
  await conversation.save();


  res.status(201).json({ ...message.toJSON(), isOwn: true });
});
