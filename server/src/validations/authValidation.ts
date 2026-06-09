import { body, cookie, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const signupValidationRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters long")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["customer", "provider", "admin"])
    .withMessage("Role must be one of: customer, provider, admin"),
];

export const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const refreshTokenValidationRules = [
  cookie("refreshToken")
    .notEmpty()
    .withMessage("Refresh token cookie is required"),
];

export const logoutValidationRules = [
  cookie("refreshToken")
    .optional()
    .isString()
    .withMessage("Refresh token must be a valid string"),
];

export const validateAuthRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Authentication validation failed",
      errors: errors.array().map((err) => err.msg),
    });
    return;
  }
  next();
};
