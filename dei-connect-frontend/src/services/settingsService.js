import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/settings/*
// -----------------------------------------------------------------------

export async function getSettings() {
  const { data } = await api.get("/settings");
  return data;
}

export async function updateSettingsSection(section, partial) {
  const { data } = await api.patch(`/settings/${section}`, partial);
  return data;
}
