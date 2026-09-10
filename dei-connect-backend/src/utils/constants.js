export const USER_ROLES = ["Student", "Faculty", "Alumni"];

export const GROUP_CATEGORIES = [
  "Academics",
  "Technology",
  "Career",
  "Sports",
  "Arts & Culture",
  "Alumni",
];

export const COMMUNITY_CATEGORIES = [...GROUP_CATEGORIES, "Wellness"];

export const RESOURCE_TYPES = ["pdf", "video", "doc", "slides"];

export const NOTIFICATION_TYPES = [
  "follow",
  "like",
  "comment",
  "group_invite",
  "community_invite",
  "message",
  "mention",
];

export const DEFAULT_SETTINGS = {
  notifications: {
    messages: true,
    announcements: true,
    groupActivity: true,
    events: false,
    emailDigest: false,
  },
  privacy: {
    profileVisibility: "everyone", // "everyone" | "connections"
    messagePermission: "everyone", // "everyone" | "connections"
    showOnlineStatus: true,
    showEmail: false,
  },
  appearance: {
    fontSize: "default", // "small" | "default" | "large"
    language: "English",
  },
  security: {
    twoFactor: false,
  },
};

export const SUPPORT_AUTO_REPLIES = [
  "Thanks for reaching out! A support team member will follow up shortly.",
  "Got it — could you share a few more details about the issue?",
  "We're looking into this. In the meantime, check the FAQ section for quick fixes.",
];
