import { Router } from "express";
import { body } from "express-validator";
import { getHelpMessages, sendHelpMessage } from "../controllers/supportController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.get("/messages", getHelpMessages);
router.post(
  "/messages",
  [body("text").trim().notEmpty().withMessage("Message can't be empty.")],
  validate,
  sendHelpMessage
);

export default router;
