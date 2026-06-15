import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Error:`, err);

  if (err?.code === 11000) {
    const conflictedField = Object.keys(err?.keyValue || {})[0] || "field";
    return res.status(409).json({
      message: `The ${conflictedField} is already taken.`,
    });
  }

  if (err?.name === "ValidationError" || err instanceof mongoose.Error.ValidationError) {
    const validationMessages = Object.values(err.errors || {}).map((errorItem: any) => errorItem?.message || "unknown error");
    return res.status(400).json({
      message: "Validation failed",
      errors: validationMessages,
    });
  }

  if (err?.statusCode && typeof err.statusCode === "number") {
    return res.status(err.statusCode).json({ message: err.message || "An error occurred" });
  }

  return res.status(500).json({ message: "Unexpected server error" });
};


