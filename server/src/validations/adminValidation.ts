import { body, param, query, validationResult } from "express-validator";
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

export const userIdParamValidationRules = [
  param("userId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid User ID format"),
];

export const toggleUserStatusValidationRules = [
  param("userId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid User ID format"),
  body("isSuspended")
    .isBoolean()
    .withMessage("isSuspended must be a boolean value"),
  body("reason")
    .optional()
    .trim(),
];

export const updateUserValidationRules = [
  param("userId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid User ID format"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email address"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),
  body("role")
    .optional()
    .isIn(["customer", "provider", "admin"])
    .withMessage("Role must be customer, provider, or admin"),
  body("hourlyRate")
    .optional()
    .isNumeric()
    .withMessage("Hourly rate must be a number"),
];

export const adminBookingsQueryValidationRules = [
  query("status")
    .optional()
    .isIn(["all", "active", "pending", "accepted", "completed", "cancelled", "declined"])
    .withMessage("Invalid status filter"),
  query("category")
    .optional()
    .trim(),
  query("city")
    .optional()
    .trim(),
  query("search")
    .optional()
    .trim(),
  query("sortBy")
    .optional()
    .isIn(["newest", "oldest", "serviceDateAsc", "serviceDateDesc"])
    .withMessage("Invalid sortBy option"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer greater than or equal to 1"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100"),
];

export const cancelAdminBookingValidationRules = [
  param("bookingId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Booking ID format"),
  body("reason")
    .optional()
    .trim(),
];

export const bookingIdParamValidationRules = [
  param("bookingId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Booking ID format"),
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
