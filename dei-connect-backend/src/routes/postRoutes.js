import { Router } from "express";
import { body } from "express-validator";
import {
  getPosts,
  createPost,
  toggleLike,
  addComment,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";
import { uploadPostAttachments } from "../middleware/upload.js";
import validate from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.get("/", getPosts);
router.post("/", uploadPostAttachments, createPost);
router.post("/:id/like", toggleLike);
router.post(
  "/:id/comments",
  [body("text").trim().notEmpty().withMessage("Comment can't be empty.")],
  validate,
  addComment
);
router.delete("/:id", deletePost);

export default router;
