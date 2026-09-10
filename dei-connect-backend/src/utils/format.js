// Mirrors the frontend's utils/helpers.js formatFileSize so numbers read
// the same way on both sides (e.g. "1.2 MB").
export function formatFileSize(bytes = 0) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

// Builds an absolute URL to a file saved under /uploads so the frontend
// can use it directly as an <img src> or download href.
export function buildFileUrl(req, relativePath) {
  return `${req.protocol}://${req.get("host")}/${relativePath.replace(/^\/+/, "")}`;
}

// Guesses a resource "type" bucket from a file's name/mime — same rule
// the frontend used to apply client-side in resourceService.guessResourceType.
export function guessResourceType(file) {
  const name = (file?.originalname || "").toLowerCase();
  const mime = file?.mimetype || "";
  if (mime.includes("pdf") || name.endsWith(".pdf")) return "pdf";
  if (mime.startsWith("video/") || /\.(mp4|mov|avi|mkv)$/.test(name)) return "video";
  if (mime.includes("presentation") || /\.(ppt|pptx)$/.test(name)) return "slides";
  return "doc";
}
