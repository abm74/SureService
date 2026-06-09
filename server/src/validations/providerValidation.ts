import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const updateProviderProfileValidationRules = [
  body("bio")
    .optional()
    .trim(),
  body("phone")
    .optional()
    .trim(),
  body("category")
    .optional()
    .trim(),
  body("hourlyRate")
    .optional()
    .isNumeric()
    .withMessage("Hourly rate must be a number")
    .custom((val) => Number(val) >= 0)
    .withMessage("Hourly rate cannot be negative"),
  body("experienceYears")
    .optional()
    .isNumeric()
    .withMessage("Experience years must be a number")
    .custom((val) => Number(val) >= 0)
    .withMessage("Experience years cannot be negative"),
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array of strings"),
  body("location")
    .optional()
    .isObject()
    .withMessage("Location must be an object with city, subCity, address"),
];

export const submitVerificationValidationRules = [
  body("verificationDocUrl")
    .trim()
    .notEmpty()
    .withMessage("Verification document URL is required"),
  body("verificationDocType")
    .optional()
    .trim()
    .isIn(["National ID", "Trade License", "Passport", "Driver's License", "Certification"])
    .withMessage("Invalid verification document type"),
];

export const providerIdValidationRules = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Provider ID format"),
];

export const validateProviderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Provider validation failed",
      errors: errors.array().map((err) => err.msg),
    });
    return;
  }
  next();
};
