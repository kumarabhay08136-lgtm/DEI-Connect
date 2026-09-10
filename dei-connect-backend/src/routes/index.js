import { Router } from "express";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profileRoutes.js";
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";
import groupRoutes from "./groupRoutes.js";
import communityRoutes from "./communityRoutes.js";
import chatRoutes from "./chatRoutes.js";
import mailRoutes from "./mailRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import resourceRoutes from "./resourceRoutes.js";
import internshipRoutes from "./internshipRoutes.js";
import supportRoutes from "./supportRoutes.js";
import settingsRoutes from "./settingsRoutes.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok", time: Date.now() }));

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/groups", groupRoutes);
router.use("/communities", communityRoutes);
router.use("/chat", chatRoutes);
router.use("/messages", mailRoutes);
router.use("/notifications", notificationRoutes);
router.use("/resources", resourceRoutes);
router.use("/internships", internshipRoutes);
router.use("/support", supportRoutes);
router.use("/settings", settingsRoutes);

export default router;
