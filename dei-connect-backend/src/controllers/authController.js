import crypto from "node:crypto";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";
import { sendMail } from "../utils/mailer.js";

// The frontend's role picker sends lowercase values ("student", "faculty",
// "alumni") while the schema enum is capitalized — normalize here so
// registration never fails on casing alone.
function normalizeRole(role) {
  if (!role) return "Student";
  const clean = role.trim().toLowerCase();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError("An account with this email already exists.", 409);

  const user = await User.create({
    name,
    email,
    password,
    role: normalizeRole(role),
    department: department || "",
    tagline: department ? `${department}` : "",
  });


  res.status(201).json({ user: user.toJSON(), token: generateToken(user._id) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Incorrect email or password.", 401);
  }
  if (!user.active) {
    throw new AppError("This account has been deactivated.", 403);
  }

  user.lastLoginAt = new Date();
  await user.save();


  res.json({ user: user.toJSON(), token: generateToken(user._id) });
});

// GET /api/auth/me — restores the session on app load (protected route).
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

// PATCH /api/auth/change-password  { currentPassword, newPassword }
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError("Current and new password are both required.", 400);
  }
  if (newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters.", 400);
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect.", 401);
  }

  user.password = newPassword; // pre-save hook re-hashes it
  await user.save();

  res.json({ message: "Password updated successfully." });
});

// POST /api/auth/deactivate — matches Settings.jsx's "Danger Zone": logs the
// account out and hides it, without permanently deleting any data.
export const deactivateAccount = asyncHandler(async (req, res) => {
  req.user.active = false;
  await req.user.save();
  res.json({ message: "Account deactivated." });
});

// POST /api/auth/forgot-password  { email }
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email?.trim()) throw new AppError("Please enter your email address.", 400);

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.json({
      message: "If an account with that email exists, we have sent a password reset link.",
    });
  }

  // Generate unhashed reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token & store in DB with 1 hour expiration
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

  const emailSent = await sendMail({
    to: user.email,
    subject: "Reset your DEI Connect password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#1e3a5f;">Reset your password</h2>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your DEI Connect password. Click the button below to choose a new one — this link expires in 1 hour.</p>
        <p style="text-align:center; margin: 32px 0;">
          <a href="${resetLink}" style="background:#1e3a5f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
        <p style="color:#888;font-size:12px;">Or paste this link into your browser: ${resetLink}</p>
      </div>
    `,
    text: `Reset your DEI Connect password: ${resetLink} (expires in 1 hour). If you didn't request this, ignore this email.`,
  });

  if (!emailSent) {
    // Email isn't configured on this server (see mailer.js) — fall back to
    // logging + returning the link directly so local development still
    // works without SMTP credentials. In a real deployment with SMTP set
    // up, this branch never runs and the link only ever goes out by email.
    console.log(`\n==================================================`);
    console.log(`🔐 EMAIL NOT SENT (SMTP not configured) — PASSWORD RESET LINK FOR: ${user.email}`);
    console.log(`👉 Link: ${resetLink}`);
    console.log(`==================================================\n`);
  }

  res.json({
    message: "If an account with that email exists, we have sent a password reset link.",
    // Only included as a dev fallback when no SMTP server is configured —
    // never sent alongside a real, successfully-delivered email.
    ...(emailSent ? {} : { resetLink }),
  });
});

// POST /api/auth/reset-password  { token, newPassword }
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new AppError("Reset token and new password are both required.", 400);
  }
  if (newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters.", 400);
  }

  // Hash the incoming token to match what's stored in the DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Password reset token is invalid or has expired.", 400);
  }

  user.password = newPassword; // pre-save hook re-hashes it
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();


  res.json({ message: "Password has been reset successfully! You can now log in with your new password." });
});
