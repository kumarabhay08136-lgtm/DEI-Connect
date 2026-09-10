import { Router } from "express";
import { getSettings, updateSettingsSection } from "../controllers/settingsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", getSettings);
router.patch("/:section", updateSettingsSection);

export default router;
