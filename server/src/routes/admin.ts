import { Router } from "express";
import {
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  getPlatformStats,
} from "../controllers/adminController.js";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";
import {
  rejectVerificationValidationRules,
  providerIdParamValidationRules,
  validateAdminRequest,
} from "../validations/adminValidation.js";

const adminRouter = Router();

adminRouter.use(authenticateToken, requireRole("admin"));

adminRouter.get("/verifications", getPendingVerifications);
adminRouter.patch(
  "/verifications/:providerId/approve",
  providerIdParamValidationRules,
  validateAdminRequest,
  approveVerification,
);
adminRouter.patch(
  "/verifications/:providerId/reject",
  rejectVerificationValidationRules,
  validateAdminRequest,
  rejectVerification,
);
adminRouter.get("/stats", getPlatformStats);

export default adminRouter;
