import { Router } from "express";
import { createReview, getProviderReviews } from "../controllers/reviewController.js";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";
import {
  createReviewValidationRules,
  reviewProviderIdParamValidationRules,
  validateReviewRequest,
} from "../validations/reviewValidation.js";

const reviewRouter = Router();

reviewRouter.post(
  "/",
  authenticateToken,
  requireRole("customer", "admin"),
  createReviewValidationRules,
  validateReviewRequest,
  createReview,
);

reviewRouter.get(
  "/provider/:providerId",
  reviewProviderIdParamValidationRules,
  validateReviewRequest,
  getProviderReviews,
);

export default reviewRouter;
