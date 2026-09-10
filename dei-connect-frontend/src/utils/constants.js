
export const APP_NAME = "DEI Connect";
export const INSTITUTE_NAME = "Dayalbagh Educational Institute";
export const INSTITUTE_SUBTITLE = "(Deemed University)";

export const COLORS = {
  primary: "#00113a",
  onPrimary: "#ffffff",
  primaryContainer: "#002366",
  onPrimaryContainer: "#758dd5",
  secondary: "#006591",
  onSurface: "#0b1c30",
  onSurfaceVariant: "#444650",
  outlineVariant: "#c5c6d2",
  background: "#f8f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eff4ff",
  terracotta: "#8C3B2E",
};

// Primary in-app navigation, shared by Sidebar (desktop) and MobileNav.
export const NAV_ITEMS = [
  { label: "Home", icon: "home", path: "/home" },
  { label: "Feed", icon: "dynamic_feed", path: "/feed" },
  { label: "Groups", icon: "groups", path: "/groups" },
  { label: "Chat", icon: "chat", path: "/chat" },
  { label: "Communities", icon: "hub", path: "/communities" },
  { label: "Resources", icon: "inventory_2", path: "/resources" },
  { label: "Internships", icon: "work", path: "/internships" },
  { label: "Profile", icon: "person", path: "/profile" },
  { label: "Settings", icon: "settings", path: "/settings" },
];

// Clean, swappable placeholders. Replace src values with real DEI assets later.
export const PLACEHOLDER_IMAGES = {

    campusHero: "/dei-connect-hero.png",

  campusSecondary:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1974&auto=format&fit=crop",
  postImage1:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
  postImage2:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
};

// Deterministic initials avatar rendered as an inline SVG data URI — no
// network request at all, so it never breaks due to ad blockers, offline
// mode, or a third-party API being down (which is what the old DiceBear-based
// version depended on).
const AVATAR_PALETTE = ["#002366", "#006591", "#8C3B2E"];

function hashSeed(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function initialsFrom(seed) {
  const parts = seed.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const avatarFor = (seed) => {
  const text = seed || "DEI Member";
  const initials = initialsFrom(text);
  const bg = AVATAR_PALETTE[hashSeed(text) % AVATAR_PALETTE.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<rect width="128" height="128" rx="64" fill="${bg}"/>` +
    `<text x="50%" y="50%" dy=".08em" text-anchor="middle" dominant-baseline="middle" ` +
    `font-family="Inter, Arial, sans-serif" font-size="52" font-weight="600" fill="#ffffff">${initials}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Prefer a user's uploaded profile picture; fall back to the generated
// initials avatar when none has been set (or removed).
export const avatarForUser = (user) => user?.avatarUrl || avatarFor(user?.name || "DEI Member");

export const STORAGE_KEYS = {
  authToken: "dei_connect_auth_token",
  authUser: "dei_connect_auth_user",
};
