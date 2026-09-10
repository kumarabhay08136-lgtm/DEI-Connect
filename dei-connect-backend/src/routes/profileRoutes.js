import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatarPhoto,
  removeAvatarPhoto,
  uploadCoverPhoto,
  removeCoverPhoto,
} from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";
import { uploadAvatar, uploadCover } from "../middleware/upload.js";

const router = Router();
router.use(protect);

router.get("/me", getProfile);
router.patch("/me", updateProfile);

router.post("/me/avatar", uploadAvatar, uploadAvatarPhoto);
router.delete("/me/avatar", removeAvatarPhoto);

router.post("/me/cover", uploadCover, uploadCoverPhoto);
router.delete("/me/cover", removeCoverPhoto);

export default router;
