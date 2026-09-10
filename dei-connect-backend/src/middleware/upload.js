import multer from "multer";
import AppError from "../utils/AppError.js";

// Every upload lands in memory as a buffer (never touches local disk here)
// so it can go straight to Cloudinary — or, if Cloudinary isn't configured,
// get written to local disk by src/utils/storage.js as a fallback. Either
// way, this middleware itself doesn't care which happens.
const storage = multer.memoryStorage();

const imageFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new AppError("Only image files are allowed here.", 400));
};

// Any type is welcome for posts/resources — the frontend explicitly
// promises "PDF, Word, PowerPoint, video — any file type".
const anyFileFilter = (_req, _file, cb) => cb(null, true);

const IMAGE_LIMIT = Number(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024; // 5 MB
const DOCUMENT_LIMIT = Number(process.env.MAX_DOCUMENT_SIZE) || 25 * 1024 * 1024; // 25 MB

export const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: IMAGE_LIMIT },
}).single("avatar");

export const uploadCover = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: IMAGE_LIMIT },
}).single("cover");

export const uploadGroupImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: IMAGE_LIMIT },
}).single("image");

export const uploadCommunityImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: IMAGE_LIMIT },
}).fields([
  { name: "banner", maxCount: 1 },
  { name: "icon", maxCount: 1 },
]);

// A post can carry an image AND a document at the same time.
export const uploadPostAttachments = multer({
  storage,
  fileFilter: anyFileFilter,
  limits: { fileSize: DOCUMENT_LIMIT },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

export const uploadResourceFile = multer({
  storage,
  fileFilter: anyFileFilter,
  limits: { fileSize: DOCUMENT_LIMIT },
}).single("file");

export const uploadChatAttachment = multer({
  storage,
  fileFilter: anyFileFilter,
  limits: { fileSize: DOCUMENT_LIMIT },
}).single("attachment");
