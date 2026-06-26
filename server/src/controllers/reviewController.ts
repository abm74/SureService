import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import * as reviewService from "../services/reviewService.js";

export const createReview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.user!.userId;
    const { bookingId, rating, comment } = req.body || {};

    const review = await reviewService.createReview(
      customerId,
      bookingId,
      Number(rating),
      comment,
    );

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const providerId = String(req.params.providerId);
    const { page, limit } = req.query;

    const result = await reviewService.getReviewsForProvider(
      providerId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
