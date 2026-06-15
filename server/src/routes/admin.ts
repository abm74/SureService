import { Router } from "express";
import {
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  getPlatformStats,
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getUserBookings,
} from "../controllers/adminController.js";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";
import {
  rejectVerificationValidationRules,
  providerIdParamValidationRules,
  userIdParamValidationRules,
  updateUserValidationRules,
  toggleUserStatusValidationRules,
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

adminRouter.get("/users", getUsers);
adminRouter.get(
  "/users/:userId",
  userIdParamValidationRules,
  validateAdminRequest,
  getUserById,
);
adminRouter.patch(
  "/users/:userId",
  updateUserValidationRules,
  validateAdminRequest,
  updateUser,
);
adminRouter.patch(
  "/users/:userId/status",
  toggleUserStatusValidationRules,
  validateAdminRequest,
  toggleUserStatus,
);
adminRouter.delete(
  "/users/:userId",
  userIdParamValidationRules,
  validateAdminRequest,
  deleteUser,
);
adminRouter.get(
  "/users/:userId/bookings",
  userIdParamValidationRules,
  validateAdminRequest,
  getUserBookings,
);

export default adminRouter;
