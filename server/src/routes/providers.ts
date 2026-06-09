import { Router } from "express";
import {
  getProviders,
  getProviderById,
  updateProviderProfile,
  submitVerification,
  getCategories,
} from "../controllers/providerController.js";
import {
  authenticateToken,
  optionalAuthenticateToken,
  requireRole,
} from "../middleware/authMiddleware.js";
import {
  updateProviderProfileValidationRules,
  submitVerificationValidationRules,
  providerIdValidationRules,
  validateProviderRequest,
} from "../validations/providerValidation.js";

const providerRouter = Router();

providerRouter.get("/", getProviders);
providerRouter.get("/categories", getCategories);
providerRouter.get(
  "/:id",
  optionalAuthenticateToken,
  providerIdValidationRules,
  validateProviderRequest,
  getProviderById,
);

providerRouter.put(
  "/profile",
  authenticateToken,
  requireRole("provider", "admin"),
  updateProviderProfileValidationRules,
  validateProviderRequest,
  updateProviderProfile,
);

providerRouter.post(
  "/verification",
  authenticateToken,
  requireRole("provider", "admin"),
  submitVerificationValidationRules,
  validateProviderRequest,
  submitVerification,
);

export default providerRouter;
