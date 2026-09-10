import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";

// Base URL will point to the future Express API, e.g. http://localhost:5000/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// No default Content-Type here on purpose: axios sets "application/json"
// automatically for plain object payloads, and sets the correct
// "multipart/form-data; boundary=..." automatically when the payload is a
// FormData instance (file uploads — avatar, cover, posts, groups,
// communities, resources). Locking Content-Type to "application/json" on
// the instance would silently break every one of those uploads.
const api = axios.create({
  baseURL: BASE_URL,
});

// Attach the JWT to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized response handling — auto logout on 401, and normalize every
// rejected error so `err.message` is the backend's actual message
// (e.g. "Incorrect email or password.") instead of Axios's generic
// "Request failed with status code 401". Every existing `catch (err) {
// setError(err.message) }` across the app then just works, with no
// per-component changes needed.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.authToken);
      localStorage.removeItem(STORAGE_KEYS.authUser);
      // Let AuthContext (and anything else listening) know the session just
      // died mid-app — without this, the UI would keep showing the user as
      // logged in until they manually refresh, even though every further
      // request will keep failing with 401.
      window.dispatchEvent(new Event("dei-connect:session-expired"));
    }
    const message = error?.response?.data?.message || error.message || "Something went wrong.";
    const normalized = new Error(message);
    normalized.status = error?.response?.status;
    normalized.errors = error?.response?.data?.errors;
    return Promise.reject(normalized);
  }
);

export default api;

