import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Community from "../models/Community.js";
import { storeUploadedFile } from "../utils/storage.js";
import notify from "../utils/notify.js";

// GET /api/communities
export const getCommunities = asyncHandler(async (req, res) => {
  const { category, q } = req.query;
  const filter = {};
  if (category && category !== "All") filter.category = category;
  if (q) filter.name = { $regex: q, $options: "i" };

  const communities = await Community.find(filter).sort({ createdAt: -1 });
  res.json(communities.map((c) => c.toJSON()));
});

// POST /api/communities  (multipart: name, description, category, banner?, icon?)
export const createCommunity = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;
  const bannerFile = req.files?.banner?.[0];
  const iconFile = req.files?.icon?.[0];

  const bannerUrl = bannerFile ? await storeUploadedFile(req, bannerFile, "communities") : null;
  const iconUrl = iconFile ? await storeUploadedFile(req, iconFile, "communities") : bannerUrl;

  const community = await Community.create({
    name,
    description,
    category,
    banner: bannerUrl,
    icon: iconUrl,
    creator: req.user._id,
    members: [req.user._id],
  });


  res.status(201).json(community.toJSON());
});

// POST /api/communities/:id/join
export const joinCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
  if (!community) throw new AppError("Community not found.", 404);

  if (!community.members.some((id) => id.equals(req.user._id))) {
    community.members.push(req.user._id);
    await community.save();
    await notify({
      userId: community.creator,
      type: "community_invite",
      actorId: req.user._id,
      message: `${req.user.name} joined ${community.name}.`,
    });
  }


  res.json(community.toJSON());
});

// POST /api/communities/:id/leave
export const leaveCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
  if (!community) throw new AppError("Community not found.", 404);

  community.members.pull(req.user._id);
  await community.save();


  res.json(community.toJSON());
});

// GET /api/communities/:id/members — populated member details
export const getCommunityMembers = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id).populate(
    "members",
    "name role department avatarUrl"
  );
  if (!community) throw new AppError("Community not found.", 404);
  res.json(community.members.map((m) => m.toPublicJSON()));
});
