import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/profile/*
// -----------------------------------------------------------------------

export async function getProfile() {
  const { data } = await api.get("/profile/me");
  return data;
}

export async function updateProfile(updates) {
  const { data } = await api.patch("/profile/me", updates);
  return data;
}

// `file` is a raw File object (from an <input type="file">), not a data URL.
export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.post("/profile/me/avatar", formData);
  return data; // { avatarUrl }
}

export async function removeAvatar() {
  const { data } = await api.delete("/profile/me/avatar");
  return data; // { avatarUrl: null }
}

export async function uploadCover(file) {
  const formData = new FormData();
  formData.append("cover", file);
  const { data } = await api.post("/profile/me/cover", formData);
  return data; // { coverUrl }
}

export async function removeCover() {
  const { data } = await api.delete("/profile/me/cover");
  return data; // { coverUrl: null }
}
