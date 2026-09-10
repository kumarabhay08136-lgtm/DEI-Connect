import { createContext, useState, useEffect, useCallback } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getStoredUser,
  getStoredToken,
  fetchCurrentUser,
} from "../services/authService";
import { primeUserDirectory, clearUserDirectory } from "../services/userDirectory";
import { STORAGE_KEYS } from "../utils/constants";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore session on first load: show the cached user instantly for a
  // snappy UI, then verify the token against the server (GET /auth/me).
  // If it's expired/invalid, the api.js interceptor already clears storage
  // on a 401 — we just mirror that into state here.
  useEffect(() => {
    const cachedUser = getStoredUser();
    const storedToken = getStoredToken();
    setUser(cachedUser);
    setToken(storedToken);

    if (storedToken) {
      (async () => {
        try {
          const freshUser = await fetchCurrentUser();
          setUser(freshUser);
          localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(freshUser));
          await primeUserDirectory();
        } catch {
          setUser(null);
          setToken(null);
        } finally {
          setInitializing(false);
        }
      })();
    } else {
      setInitializing(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const { user: loggedInUser, token: authToken } = await loginUser(credentials);
    setUser(loggedInUser);
    setToken(authToken);
    await primeUserDirectory();
    return loggedInUser;
  }, []);

  const register = useCallback(async (details) => {
    const { user: newUser, token: authToken } = await registerUser(details);
    setUser(newUser);
    setToken(authToken);
    await primeUserDirectory();
    return newUser;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    clearUserDirectory();
    setUser(null);
    setToken(null);
  }, []);

  // If any API call gets a 401 mid-session (expired/invalid token), api.js
  // already clears storage — this just syncs that into React state so the
  // UI redirects to /login instead of silently failing forever.
  useEffect(() => {
    const handleSessionExpired = () => {
      clearUserDirectory();
      setUser(null);
      setToken(null);
    };
    window.addEventListener("dei-connect:session-expired", handleSessionExpired);
    return () => window.removeEventListener("dei-connect:session-expired", handleSessionExpired);
  }, []);

  // Persist profile-field edits (avatar/cover URLs after upload, etc.) made
  // from the Profile or Settings pages.
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    initializing,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
