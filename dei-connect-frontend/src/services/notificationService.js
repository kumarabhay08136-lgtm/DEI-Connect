import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/notifications/*
// Notifications themselves are created server-side (on follow, like,
// comment, group message, etc.) — this service only reads/marks them.
// -----------------------------------------------------------------------

export async function getNotifications() {
  const { data } = await api.get("/notifications");
  return data;
}

export async function markAsRead(id) {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
}

export async function markAllAsRead() {
  const { data } = await api.patch("/notifications/read-all");
  return data;
}
