import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/chat/* (1:1 direct messages).
// Group chat lives in groupService.js since it's scoped to /api/groups/:id.
// -----------------------------------------------------------------------

// One row per 1:1 thread the user is in, already shaped for ConversationList.
export async function getConversations() {
  const { data } = await api.get("/chat/conversations");
  return data;
}

// Finds or creates the 1:1 thread with `userId` and returns it.
export async function startConversation(userId) {
  const { data } = await api.post("/chat/conversations", { userId });
  return data;
}

export async function getMessages(conversationId) {
  const { data } = await api.get(`/chat/conversations/${conversationId}/messages`);
  return data;
}

// `attachment` is an optional raw File object.
export async function sendMessage(conversationId, { text, attachment } = {}) {
  const formData = new FormData();
  if (text) formData.append("text", text);
  if (attachment instanceof File) formData.append("attachment", attachment);
  const { data } = await api.post(`/chat/conversations/${conversationId}/messages`, formData);
  return data;
}
