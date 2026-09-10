import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Resource from "../models/Resource.js";
import { formatFileSize, guessResourceType } from "../utils/format.js";
import { storeUploadedFile } from "../utils/storage.js";

// GET /api/resources?type=&q=
export const getResources = asyncHandler(async (req, res) => {
  const { type, q } = req.query;
  const filter = {};
  if (type && type !== "All") filter.type = type;
  if (q) filter.title = { $regex: q, $options: "i" };

  const resources = await Resource.find(filter).sort({ createdAt: -1 });
  res.json(resources.map((r) => r.toJSON()));
});

// POST /api/resources  (multipart: title, description, department, type?, file)
export const addResource = asyncHandler(async (req, res) => {
  const { title, description, department, type } = req.body;
  if (!title?.trim() || !description?.trim()) {
    throw new AppError("Title and description are required.", 400);
  }

  const resource = await Resource.create({
    title: title.trim(),
    description: description.trim(),
    department: department?.trim() || "General",
    type: type || (req.file ? guessResourceType(req.file) : "doc"),
    fileUrl: req.file ? await storeUploadedFile(req, req.file, "resources") : null,
    fileName: req.file?.originalname || null,
    size: req.file ? formatFileSize(req.file.size) : "—",
    author: req.user._id,
  });

  res.status(201).json(resource.toJSON());
});
