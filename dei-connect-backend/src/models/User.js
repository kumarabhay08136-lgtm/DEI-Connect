import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { USER_ROLES, DEFAULT_SETTINGS } from "../utils/constants.js";

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, default: "Dayalbagh Educational Institute" },
    degree: { type: String, default: "" },
    years: { type: String, default: "" },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    notifications: {
      messages: { type: Boolean, default: DEFAULT_SETTINGS.notifications.messages },
      announcements: { type: Boolean, default: DEFAULT_SETTINGS.notifications.announcements },
      groupActivity: { type: Boolean, default: DEFAULT_SETTINGS.notifications.groupActivity },
      events: { type: Boolean, default: DEFAULT_SETTINGS.notifications.events },
      emailDigest: { type: Boolean, default: DEFAULT_SETTINGS.notifications.emailDigest },
    },
    privacy: {
      profileVisibility: { type: String, default: DEFAULT_SETTINGS.privacy.profileVisibility },
      messagePermission: { type: String, default: DEFAULT_SETTINGS.privacy.messagePermission },
      showOnlineStatus: { type: Boolean, default: DEFAULT_SETTINGS.privacy.showOnlineStatus },
      showEmail: { type: Boolean, default: DEFAULT_SETTINGS.privacy.showEmail },
    },
    appearance: {
      fontSize: { type: String, default: DEFAULT_SETTINGS.appearance.fontSize },
      language: { type: String, default: DEFAULT_SETTINGS.appearance.language },
    },
    security: {
      twoFactor: { type: Boolean, default: DEFAULT_SETTINGS.security.twoFactor },
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: USER_ROLES, default: "Student" },
    department: { type: String, default: "", trim: true },
    semester: { type: String, default: "" },
    active: { type: Boolean, default: true },

    // Profile
    tagline: { type: String, default: "", maxlength: 140 },
    about: { type: String, default: "", maxlength: 1000 },
    bio: { type: String, default: "", maxlength: 280 }, // short line shown in Feed cards
    education: { type: educationSchema, default: () => ({}) },
    skills: [{ type: String, trim: true }],

    avatarUrl: { type: String, default: null },
    coverUrl: { type: String, default: null },

    settings: { type: settingsSchema, default: () => ({}) },

    lastLoginAt: { type: Date, default: null },

    resetPasswordToken: { type: String, default: null, select: false },
    resetPasswordExpires: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

userSchema.index({ name: "text", department: 1 });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Public-facing shape for viewing ANOTHER user (Feed cards, profile pages,
// post authors, etc). Never includes password, resetPassword*, or the raw
// `settings` object — those stay private to the account owner.
//
// `isConnection` (the viewer follows this user, or is followed back) lets a
// user opt their full profile down to just the basics for non-connections
// via Settings > Privacy > "Who can see my profile". Email is only ever
// included if the user explicitly turned on "Show email" in that same panel.
userSchema.methods.toPublicJSON = function toPublicJSON({ isConnection = false } = {}) {
  const base = {
    id: this._id.toString(),
    name: this.name,
    role: this.role,
    department: this.department,
    bio: this.bio,
    avatarUrl: this.avatarUrl,
  };

  const visibility = this.settings?.privacy?.profileVisibility || "everyone";
  const canSeeFullProfile = visibility === "everyone" || isConnection;
  if (!canSeeFullProfile) return base;

  return {
    ...base,
    semester: this.semester,
    tagline: this.tagline,
    about: this.about,
    education: this.education,
    skills: this.skills,
    coverUrl: this.coverUrl,
    createdAt: this.createdAt ? this.createdAt.getTime() : null,
    ...(this.settings?.privacy?.showEmail ? { email: this.email } : {}),
  };
};

// Users need their own transform (strip password, keep the rest) rather
// than the generic plugin, so it's defined directly here.
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password;
    if (ret.createdAt instanceof Date) ret.createdAt = ret.createdAt.getTime();
    delete ret.updatedAt;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
