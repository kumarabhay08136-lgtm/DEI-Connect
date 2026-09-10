import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/resources/*
// -----------------------------------------------------------------------

// Guess a card "type" bucket from a file's name/mime so the right icon shows
// before the upload completes and the server confirms the type.
export function guessResourceType(file) {
  const name = (file?.name || "").toLowerCase();
  const mime = file?.type || "";
  if (mime.includes("pdf") || name.endsWith(".pdf")) return "pdf";
  if (mime.startsWith("video/") || /\.(mp4|mov|avi|mkv)$/.test(name)) return "video";
  if (mime.includes("presentation") || /\.(ppt|pptx)$/.test(name)) return "slides";
  return "doc";
}

export async function getResources() {
  const { data } = await api.get("/resources");
  return data;
}

// `file` is the raw File object (from an <input type="file">).
export async function addResource({ title, description, department, type, file }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  if (department) formData.append("department", department);
  if (type) formData.append("type", type);
  if (file instanceof File) formData.append("file", file);
  const { data } = await api.post("/resources", formData);
  return data;
}
