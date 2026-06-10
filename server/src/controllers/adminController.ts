import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import * as adminService from "../services/adminService.js";

export const getPendingVerifications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit } = req.query;
    const result = await adminService.getPendingVerifications(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const approveVerification = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const providerId = req.params.providerId as string;
    const provider = await adminService.approveVerification(providerId);

    res.status(200).json({
      message: "Provider verification approved (+25 Trust Score applied)",
      provider,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectVerification = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const providerId = req.params.providerId as string;
    const { reason } = req.body;

    const provider = await adminService.rejectVerification(providerId, reason);

    res.status(200).json({
      message: "Provider verification rejected",
      provider,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlatformStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await adminService.getPlatformStats();
    res.status(200).json({ stats });
  } catch (error) {
    next(error);
  }
};
