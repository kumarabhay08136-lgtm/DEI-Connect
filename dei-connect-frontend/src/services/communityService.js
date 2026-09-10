import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/communities/*
// -----------------------------------------------------------------------

export async function getCommunities() {
  const { data } = await api.get("/communities");
  return data;
}

export async function getCommunityMembers(id) {
  const { data } = await api.get(`/communities/${id}/members`);
  return data;
}

// `banner` and `icon` are raw File objects or null/undefined.
export async function createCommunity({ name, description, category, banner, icon }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("category", category);
  if (banner instanceof File) formData.append("banner", banner);
  if (icon instanceof File) formData.append("icon", icon);
  const { data } = await api.post("/communities", formData);
  return data;
}

export async function joinCommunity(communityId) {
  const { data } = await api.post(`/communities/${communityId}/join`);
  return data;
}

export async function leaveCommunity(communityId) {
  const { data } = await api.post(`/communities/${communityId}/leave`);
  return data;
}
