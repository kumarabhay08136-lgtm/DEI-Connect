import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import { register, login, getMe, changePassword, deactivateAccount, forgotPassword, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = Router();

// A handful of brute-force attempts is normal; hundreds in a few minutes is not.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Enter a valid email address."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ],
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Enter a valid email address."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().withMessage("Enter a valid email address.")],
  validate,
  forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  [
    body("token").notEmpty().withMessage("Reset token is required."),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters."),
  ],
  validate,
  resetPassword
);

router.get("/me", protect, getMe);
router.patch("/change-password", protect, changePassword);
router.post("/deactivate", protect, deactivateAccount);

export default router;
