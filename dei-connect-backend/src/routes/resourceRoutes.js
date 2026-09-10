import { Router } from "express";
import { body } from "express-validator";
import { getResources, addResource } from "../controllers/resourceController.js";
import { protect } from "../middleware/auth.js";
import { uploadResourceFile } from "../middleware/upload.js";
import validate from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.get("/", getResources);
router.post(
  "/",
  uploadResourceFile,
  [
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("description").trim().notEmpty().withMessage("Description is required."),
  ],
  validate,
  addResource
);

export default router;
