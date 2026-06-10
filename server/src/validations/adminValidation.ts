import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const rejectVerificationValidationRules = [
  param("providerId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Provider ID format"),
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Rejection reason is required")
    .isLength({ min: 5 })
    .withMessage("Rejection reason must be at least 5 characters long"),
];

export const providerIdParamValidationRules = [
  param("providerId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Provider ID format"),
];

export const validateAdminRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Admin action validation failed",
      errors: errors.array().map((err) => err.msg),
    });
    return;
  }
  next();
};
