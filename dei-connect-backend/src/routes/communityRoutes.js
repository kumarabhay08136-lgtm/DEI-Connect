import { Router } from "express";
import { body } from "express-validator";
import {
  getCommunities,
  createCommunity,
  joinCommunity,
  leaveCommunity,
  getCommunityMembers,
} from "../controllers/communityController.js";
import { protect } from "../middleware/auth.js";
import { uploadCommunityImages } from "../middleware/upload.js";
import validate from "../middleware/validate.js";
import { COMMUNITY_CATEGORIES } from "../utils/constants.js";

const router = Router();
router.use(protect);

router.get("/", getCommunities);
router.post(
  "/",
  uploadCommunityImages,
  [
    body("name").trim().notEmpty().withMessage("Community name is required."),
    body("description").trim().notEmpty().withMessage("Description is required."),
    body("category").isIn(COMMUNITY_CATEGORIES).withMessage("Choose a valid category."),
  ],
  validate,
  createCommunity
);
router.post("/:id/join", joinCommunity);
router.post("/:id/leave", leaveCommunity);
router.get("/:id/members", getCommunityMembers);

export default router;
