import api from "./api";

// -----------------------------------------------------------------------
// Many components (PostCard, MessageList, NotificationDropdown, etc.) look
// up a user's name/avatar by id *synchronously* during render — a pattern
// carried over from the old MOCK_USERS array. Real user data has to come
// from the network, so this module fetches the full user list once per
// session and caches it in memory, giving the rest of the app the same
// synchronous `getUserById(id)` it already relies on.
// -----------------------------------------------------------------------

const cache = new Map();
let primed = false;
let primingPromise = null;

// Merge a list of user records into the cache (e.g. after GET /users).
export function cacheUsers(users = []) {
  users.forEach((u) => {
    if (u?.id) cache.set(u.id, u);
  });
}

// Merge a single fresh user record into the cache (e.g. after fetching
// GET /users/:id for a profile that wasn't in the initial directory).
export function cacheUser(user) {
  if (user?.id) cache.set(user.id, user);
}

// Fetch and cache every user once. Safe to call many times — subsequent
// calls reuse the in-flight promise or resolve instantly once primed.
export async function primeUserDirectory() {
  if (primed) return;
  if (primingPromise) return primingPromise;

  primingPromise = api
    .get("/users")
    .then(({ data }) => {
      cacheUsers(data);
      primed = true;
    })
    .catch(() => {
      // Network hiccup — leave `primed` false so a later call retries.
    })
    .finally(() => {
      primingPromise = null;
    });

  return primingPromise;
}

// Synchronous lookup used directly inside render. Returns null if the
// directory hasn't been primed yet or the user isn't in the cache.
export function getUserById(id) {
  if (!id) return null;
  return cache.get(id) || null;
}

export function getCachedUsers() {
  return Array.from(cache.values());
}

// Called on logout so a different account doesn't inherit stale data.
export function clearUserDirectory() {
  cache.clear();
  primed = false;
  primingPromise = null;
}
