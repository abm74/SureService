import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import * as providerService from "../services/providerService.js";

export const getProviders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      category,
      city,
      subCity,
      minScore,
      maxRate,
      verificationStatus,
      search,
      sortBy,
      page,
      limit,
    } = req.query;

    const result = await providerService.getProviders({
      category: category as string | undefined,
      city: city as string | undefined,
      subCity: subCity as string | undefined,
      minScore: minScore ? Number(minScore) : undefined,
      maxRate: maxRate ? Number(maxRate) : undefined,
      verificationStatus: verificationStatus as string | undefined,
      search: search as string | undefined,
      sortBy: sortBy as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProviderById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;

    const result = await providerService.getProviderById(id, currentUserId, currentUserRole);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProviderProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const providerId = req.user!.userId;
    const updatedProvider = await providerService.updateProviderProfile(providerId, req.body);

    res.status(200).json({
      message: "Provider profile updated successfully",
      provider: updatedProvider,
    });
  } catch (error) {
    next(error);
  }
};

export const submitVerification = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const providerId = req.user!.userId;
    const { verificationDocUrl, verificationDocType } = req.body;

    const provider = await providerService.submitVerification(
      providerId,
      verificationDocUrl,
      verificationDocType,
    );

    res.status(200).json({
      message: "Verification submitted for admin review",
      provider,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await providerService.getCategories();
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};
