import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/messages/*
// -----------------------------------------------------------------------

export async function getInbox() {
  const { data } = await api.get("/messages", { params: { folder: "inbox" } });
  return data;
}

export async function getSent() {
  const { data } = await api.get("/messages", { params: { folder: "sent" } });
  return data;
}

export async function sendMessage({ toId, subject, body, threadId }) {
  const { data } = await api.post("/messages", { toId, subject, body, threadId });
  return data;
}

export async function markMessageRead(id) {
  const { data } = await api.patch(`/messages/${id}/read`);
  return data;
}
