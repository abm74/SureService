import { Router } from "express";
import { getCloudinarySignature } from "../controllers/uploadController.js";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";

const uploadRouter = Router();

uploadRouter.post(
  "/sign",
  authenticateToken,
  requireRole("provider", "admin"),
  getCloudinarySignature
);

export default uploadRouter;
