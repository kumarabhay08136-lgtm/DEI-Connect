import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/support/*
// -----------------------------------------------------------------------

export async function getHelpMessages() {
  const { data } = await api.get("/support/messages");
  return data;
}

export async function sendHelpMessage(text) {
  const { data } = await api.post("/support/messages", { text });
  return data;
}
