import { Router } from "express";
import { body } from "express-validator";
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
} from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";
import { uploadChatAttachment } from "../middleware/upload.js";
import validate from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.get("/conversations", getConversations);
router.post(
  "/conversations",
  [body("userId").notEmpty().withMessage("userId is required.")],
  validate,
  startConversation
);
router.get("/conversations/:id/messages", getMessages);
router.post("/conversations/:id/messages", uploadChatAttachment, sendMessage);

export default router;
