import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  getFollowing,
  followUser,
  unfollowUser,
} from "../controllers/userController.js";
import { getPostsByAuthor } from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", getAllUsers);
router.get("/me/following", getFollowing);
router.get("/:id", getUserById);
router.get("/:authorId/posts", getPostsByAuthor);
router.post("/:id/follow", followUser);
router.delete("/:id/follow", unfollowUser);

export default router;
