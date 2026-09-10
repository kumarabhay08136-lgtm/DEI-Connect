import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/posts/*
// -----------------------------------------------------------------------

export async function getPosts() {
  const { data } = await api.get("/posts");
  return data;
}

export async function getPostsByAuthor(authorId) {
  const { data } = await api.get(`/users/${authorId}/posts`);
  return data;
}

// `image` and `file` are raw File objects (or null/undefined) — not data URLs.
export async function createPost({ content, image, file }) {
  const formData = new FormData();
  if (content) formData.append("content", content);
  if (image instanceof File) formData.append("image", image);
  if (file instanceof File) formData.append("file", file);
  const { data } = await api.post("/posts", formData);
  return data;
}

export async function toggleLike(postId) {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
}

export async function addComment(postId, text) {
  const { data } = await api.post(`/posts/${postId}/comments`, { text });
  return data;
}

export async function deletePost(postId) {
  await api.delete(`/posts/${postId}`);
  return true;
}
