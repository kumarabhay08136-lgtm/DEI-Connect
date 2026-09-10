import api from "./api";
import { cacheUsers, cacheUser } from "./userDirectory";

// -----------------------------------------------------------------------
// Real backend calls — /api/users/*
// -----------------------------------------------------------------------

export async function getAllUsers() {
  const { data } = await api.get("/users");
  cacheUsers(data);
  return data;
}

export async function getFollowing() {
  const { data } = await api.get("/users/me/following");
  return data;
}

// A single user's full public profile (about, education, skills, cover
// photo, etc — subject to that user's own privacy setting). Powers the
// "view someone else's profile" page.
export async function getUserById(id) {
  const { data } = await api.get(`/users/${id}`);
  cacheUser(data);
  return data;
}

export async function followUser(userId) {
  const { data } = await api.post(`/users/${userId}/follow`);
  return data;
}

export async function unfollowUser(userId) {
  const { data } = await api.delete(`/users/${userId}/follow`);
  return data;
}
