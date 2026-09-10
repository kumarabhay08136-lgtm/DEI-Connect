import api from "./api";

// -----------------------------------------------------------------------
// Real backend calls — /api/internships/*
// -----------------------------------------------------------------------

export async function getInternships() {
  const { data } = await api.get("/internships");
  return data;
}

export async function createInternship(payload) {
  const { data } = await api.post("/internships", payload);
  return data;
}

export async function applyToInternship(internshipId) {
  const { data } = await api.post(`/internships/${internshipId}/apply`);
  return data.applied === true;
}

export async function getAppliedInternshipIds() {
  const { data } = await api.get("/internships/applied");
  return data;
}
