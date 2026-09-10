import { v2 as cloudinary } from "cloudinary";

// -----------------------------------------------------------------------
// Cloud storage for every uploaded photo/video/document (avatars, covers,
// post media, group/community images, resources, chat attachments) — via
// Cloudinary's free tier. Configured entirely through env vars:
//
//   CLOUDINARY_CLOUD_NAME
//   CLOUDINARY_API_KEY
//   CLOUDINARY_API_SECRET
//
// Get all three free at https://cloudinary.com/users/register/free —
// they're shown on your Cloudinary dashboard right after signup.
//
// If they're not set, `isCloudinaryConfigured` is false and storage.js
// falls back to saving files on local disk (uploads/), so local dev still
// works without a Cloudinary account.
// -----------------------------------------------------------------------

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

export const isCloudinaryConfigured = Boolean(
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
} else {
  console.warn(
    "\n⚠️  Cloudinary is not configured — CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET are missing from .env.\n" +
      "   Uploaded photos/videos/files will be saved to local disk (uploads/) instead of the cloud.\n" +
      "   Sign up free at https://cloudinary.com and add those three keys to store them in the cloud instead.\n"
  );
}

// Uploads a raw file buffer (from multer's memoryStorage) straight to
// Cloudinary via a stream — no temp file ever touches disk.
export function uploadBuffer(buffer, { folder, resourceType = "auto", publicId }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `dei-connect/${folder}`,
        resource_type: resourceType,
        public_id: publicId,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

// Best-effort delete of a previously-uploaded Cloudinary asset, given its
// full secure_url (e.g. when a user replaces their avatar or removes it).
export async function deleteByUrl(url) {
  if (!url || !url.includes("res.cloudinary.com")) return;

  // .../upload/v169.../dei-connect/avatars/173-abc123.jpg  ->  dei-connect/avatars/173-abc123
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);
  if (!match) return;

  const publicId = match[1];
  const resourceType = url.includes("/video/upload/") ? "video" : url.includes("/raw/upload/") ? "raw" : "image";

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn(`Could not delete old Cloudinary asset ${publicId}:`, err.message);
  }
}

export default cloudinary;
