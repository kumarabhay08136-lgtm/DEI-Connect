import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Group from "../models/Group.js";
import GroupMessage from "../models/GroupMessage.js";
import { storeUploadedFile } from "../utils/storage.js";
import notify from "../utils/notify.js";

// GET /api/groups
export const getGroups = asyncHandler(async (req, res) => {
  const { category, q } = req.query;
  const filter = {};
  if (category && category !== "All") filter.category = category;
  if (q) filter.name = { $regex: q, $options: "i" };

  const groups = await Group.find(filter).sort({ createdAt: -1 });
  res.json(groups.map((g) => g.toJSON()));
});

// GET /api/groups/:id
export const getGroupById = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) throw new AppError("Group not found.", 404);
  res.json(group.toJSON());
});

// GET /api/groups/:id/members — populated member details for GroupMembersList.jsx
export const getGroupMembers = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id).populate(
    "members",
    "name role department avatarUrl"
  );
  if (!group) throw new AppError("Group not found.", 404);
  res.json(group.members.map((m) => m.toPublicJSON()));
});

// POST /api/groups  (multipart: name, description, category, tags, image?)
export const createGroup = asyncHandler(async (req, res) => {
  const { name, description, category, tags } = req.body;

  const group = await Group.create({
    name,
    description,
    category,
    tags: Array.isArray(tags)
      ? tags
      : (tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    image: req.file ? await storeUploadedFile(req, req.file, "groups") : null,
    creator: req.user._id,
    members: [req.user._id],
  });


  res.status(201).json(group.toJSON());
});

// POST /api/groups/:id/join
export const joinGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) throw new AppError("Group not found.", 404);

  if (!group.members.some((id) => id.equals(req.user._id))) {
    group.members.push(req.user._id);
    await group.save();
  }


  res.json(group.toJSON());
});

// POST /api/groups/:id/leave
export const leaveGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) throw new AppError("Group not found.", 404);

  group.members.pull(req.user._id);
  await group.save();


  res.json(group.toJSON());
});

// GET /api/groups/:id/messages
export const getGroupMessages = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) throw new AppError("Group not found.", 404);
  if (!group.members.some((id) => id.equals(req.user._id))) {
    throw new AppError("Join this group to view its chat.", 403);
  }

  const messages = await GroupMessage.find({ group: group._id }).sort({ createdAt: 1 });
  res.json(messages.map((m) => m.toJSON()));
});

// POST /api/groups/:id/messages  { text }
export const sendGroupMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw new AppError("Message text is required.", 400);

  const group = await Group.findById(req.params.id);
  if (!group) throw new AppError("Group not found.", 404);
  if (!group.members.some((id) => id.equals(req.user._id))) {
    throw new AppError("Join this group to send messages.", 403);
  }

  const message = await GroupMessage.create({
    group: group._id,
    sender: req.user._id,
    text: text.trim(),
  });

  const recipients = group.members.filter((id) => !id.equals(req.user._id));
  await Promise.all(
    recipients.map((userId) =>
      notify({
        userId,
        type: "group_invite",
        actorId: req.user._id,
        message: `New message in ${group.name}.`,
      })
    )
  );

  res.status(201).json(message.toJSON());
});
