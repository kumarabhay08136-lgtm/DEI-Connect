import { STORAGE_KEYS } from "./constants";

// Reads the *currently logged-in* user straight from localStorage every time
// it's called (rather than a stale value captured at import time), so it
// always reflects whoever is signed in — including right after login/logout,
// without requiring a page reload.
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.authUser);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getCurrentUserId() {
  return getCurrentUser()?.id || null;
}
