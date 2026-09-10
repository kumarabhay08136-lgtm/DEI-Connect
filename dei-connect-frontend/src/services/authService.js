import api from "./api";
import { STORAGE_KEYS } from "../utils/constants";
import { clearUserDirectory } from "./userDirectory";

// -----------------------------------------------------------------------
// Real backend auth — talks to /api/auth/* on the Express server.
// -----------------------------------------------------------------------

function persistSession(user, token) {
  localStorage.setItem(STORAGE_KEYS.authToken, token);
  localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
}

export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  persistSession(data.user, data.token);
  return data;
}

export async function registerUser({ name, email, password, role, department }) {
  const { data } = await api.post("/auth/register", { name, email, password, role, department });
  persistSession(data.user, data.token);
  return data;
}

export async function requestPasswordReset({ email }) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword({ token, newPassword }) {
  const { data } = await api.post("/auth/reset-password", { token, newPassword });
  return data;
}

// Verifies the stored token is still valid and returns the freshest user
// record — used to restore a session on app load.
export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.user;
}

export async function changePassword({ currentPassword, newPassword }) {
  const { data } = await api.patch("/auth/change-password", { currentPassword, newPassword });
  return data;
}

export async function deactivateAccount() {
  const { data } = await api.post("/auth/deactivate");
  return data;
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.authToken);
  localStorage.removeItem(STORAGE_KEYS.authUser);
  clearUserDirectory();
}

export function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.authUser);
  return raw ? JSON.parse(raw) : null;
}

export function getStoredToken() {
  return localStorage.getItem(STORAGE_KEYS.authToken);
}
