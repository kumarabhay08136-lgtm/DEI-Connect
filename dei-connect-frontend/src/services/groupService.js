import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/groups/*
// -----------------------------------------------------------------------

export async function getGroups() {
  const { data } = await api.get("/groups");
  return data;
}

export async function getGroupById(id) {
  const { data } = await api.get(`/groups/${id}`);
  return data;
}

export async function getGroupMembers(id) {
  const { data } = await api.get(`/groups/${id}/members`);
  return data;
}

// `image` is a raw File object or null/undefined.
export async function createGroup({ name, description, category, tags, image }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("category", category);
  (tags || []).forEach((tag) => formData.append("tags", tag));
  if (image instanceof File) formData.append("image", image);
  const { data } = await api.post("/groups", formData);
  return data;
}

export async function joinGroup(groupId) {
  const { data } = await api.post(`/groups/${groupId}/join`);
  return data;
}

export async function leaveGroup(groupId) {
  const { data } = await api.post(`/groups/${groupId}/leave`);
  return data;
}

export async function getGroupMessages(groupId) {
  const { data } = await api.get(`/groups/${groupId}/messages`);
  return data;
}

export async function sendGroupMessage(groupId, text) {
  const { data } = await api.post(`/groups/${groupId}/messages`, { text });
  return data;
}
