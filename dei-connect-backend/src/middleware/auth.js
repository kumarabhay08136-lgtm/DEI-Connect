import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import User from "../models/User.js";

// Verifies the "Authorization: Bearer <token>" header the frontend's
// api.js already attaches to every request, and loads the full user
// document onto req.user for downstream controllers to use.
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new AppError("Not authorized — please log in.", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Session expired — please log in again.", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("The account for this session no longer exists.", 401);
  }
  if (!user.active) {
    throw new AppError("This account has been deactivated.", 403);
  }

  req.user = user;
  next();
});

// Optional variant: attaches req.user when a valid token is present, but
// never rejects the request. Useful for endpoints that behave slightly
// differently for logged-in vs anonymous callers, if ever needed.
export const attachUserIfPresent = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch {
    // Invalid/expired token on an optional route — just proceed as a guest.
  }
  next();
});

// Restricts a route to specific roles, e.g. restrictTo("Faculty").
export const restrictTo = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new AppError("You don't have permission to do that.", 403);
  }
  next();
};
