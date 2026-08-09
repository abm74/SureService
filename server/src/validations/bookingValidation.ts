import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getCategoryNames } from "../services/categoryService.js";

export const createBookingValidationRules = [
  body("providerId")
    .notEmpty()
    .withMessage("Provider ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Provider ID format"),
  body("category")
    .isString()
    .withMessage("Service category must be a string")
    .trim()
    .notEmpty()
    .withMessage("Service category is required")
    .custom(async (val) => {
      if (typeof val !== "string") return false;
      const allowed = await getCategoryNames();
      if (allowed.length > 0 && !allowed.some((c) => c.toLowerCase() === val.toLowerCase())) {
        throw new Error("Invalid service category");
      }
      return true;
    }),
  body("serviceDate")
    .trim()
    .notEmpty()
    .withMessage("Service date is required"),
  body("timeSlot")
    .trim()
    .notEmpty()
    .withMessage("Time slot is required"),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Service address is required"),
  body("city")
    .optional()
    .trim(),
  body("subCity")
    .optional()
    .trim(),
  body("notes")
    .optional()
    .trim(),
];

export const cancelBookingValidationRules = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Booking ID format"),
  body("reason")
    .optional()
    .trim(),
];

export const bookingIdValidationRules = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Booking ID format"),
];

export const validateBookingRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Booking validation failed",
      errors: errors.array().map((err) => err.msg),
    });
    return;
  }
  next();
};
