import { Router } from "express";
import { body } from "express-validator";
import { getMessages, sendMessage, markMessageRead } from "../controllers/mailController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.get("/", getMessages);
router.post(
  "/",
  [
    body("toId").notEmpty().withMessage("Recipient is required."),
    body("subject").trim().notEmpty().withMessage("Subject is required."),
    body("body").trim().notEmpty().withMessage("Message body is required."),
  ],
  validate,
  sendMessage
);
router.patch("/:id/read", markMessageRead);

export default router;
