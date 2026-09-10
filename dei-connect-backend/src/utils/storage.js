import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { buildFileUrl } from "./format.js";
import { isCloudinaryConfigured, uploadBuffer, deleteByUrl } from "./cloudinary.js";

function uniqueName(originalname) {
  const ext = path.extname(originalname);
  const base = path
    .basename(originalname, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 40);
  const stamp = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  return { stamp: base ? `${stamp}-${base}` : stamp, ext };
}

function resourceTypeFor(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "raw"; // pdf, docx, pptx, etc.
}

/**
 * Saves an uploaded file (a multer memoryStorage file — has `.buffer`) to
 * Cloudinary when configured, otherwise to local disk under uploads/<folder>/.
 * Either way, returns the public URL to store on the Mongo document — the
 * rest of the app never needs to know which one actually happened.
 */
export async function storeUploadedFile(req, file, folder) {
  const { stamp, ext } = uniqueName(file.originalname);

  if (isCloudinaryConfigured) {
    const result = await uploadBuffer(file.buffer, {
      folder,
      resourceType: resourceTypeFor(file.mimetype),
      publicId: stamp,
    });
    return result.secure_url;
  }

  // Local disk fallback — same layout as before.
  const dir = path.join(process.cwd(), "uploads", folder);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${stamp}${ext}`;
  fs.writeFileSync(path.join(dir, filename), file.buffer);
  return buildFileUrl(req, `uploads/${folder}/${filename}`);
}

/** Best-effort delete of a previously-stored file, cloud or local. */
export function deleteStoredFile(url) {
  if (!url) return;

  if (url.includes("res.cloudinary.com")) {
    deleteByUrl(url); // fire-and-forget, already catches its own errors
    return;
  }

  const relative = url.split("/uploads/")[1];
  if (!relative) return;
  const filePath = path.join(process.cwd(), "uploads", relative);
  fs.unlink(filePath, () => {}); // ignore errors — best-effort cleanup
}
