import { Router } from "express";
import { body } from "express-validator";
import {
  getInternships,
  createInternship,
  applyToInternship,
  getAppliedInternshipIds,
} from "../controllers/internshipController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.get("/", getInternships);
router.get("/applied", getAppliedInternshipIds);
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("organization").trim().notEmpty().withMessage("Organization is required."),
    body("description").trim().notEmpty().withMessage("Description is required."),
  ],
  validate,
  createInternship
);
router.post("/:id/apply", applyToInternship);

export default router;
