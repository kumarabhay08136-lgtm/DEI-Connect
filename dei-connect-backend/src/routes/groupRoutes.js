import { Router } from "express";
import { body } from "express-validator";
import {
  getGroups,
  getGroupById,
  getGroupMembers,
  createGroup,
  joinGroup,
  leaveGroup,
  getGroupMessages,
  sendGroupMessage,
} from "../controllers/groupController.js";
import { protect } from "../middleware/auth.js";
import { uploadGroupImage } from "../middleware/upload.js";
import validate from "../middleware/validate.js";
import { GROUP_CATEGORIES } from "../utils/constants.js";

const router = Router();
router.use(protect);

router.get("/", getGroups);
router.post(
  "/",
  uploadGroupImage,
  [
    body("name").trim().notEmpty().withMessage("Group name is required."),
    body("description").trim().notEmpty().withMessage("Description is required."),
    body("category").isIn(GROUP_CATEGORIES).withMessage("Choose a valid category."),
  ],
  validate,
  createGroup
);
router.get("/:id", getGroupById);
router.get("/:id/members", getGroupMembers);
router.post("/:id/join", joinGroup);
router.post("/:id/leave", leaveGroup);
router.get("/:id/messages", getGroupMessages);
router.post(
  "/:id/messages",
  [body("text").trim().notEmpty().withMessage("Message can't be empty.")],
  validate,
  sendGroupMessage
);

export default router;
