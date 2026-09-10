// Tiny helper for seeding + persisting demo data in localStorage.
// Every service module below is built on this, so the data survives
// page refreshes without needing a real backend yet.

export function loadOrSeed(key, seedValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to reseed on parse errors
  }
  localStorage.setItem(key, JSON.stringify(seedValue));
  return seedValue;
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
