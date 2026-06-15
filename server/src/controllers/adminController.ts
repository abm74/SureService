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
      message: "Provider verification approved and verified shield activated",
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

export const getUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      role,
      status,
      verificationStatus,
      search,
      city,
      sortBy,
      page,
      limit,
    } = req.query;

    const result = await adminService.getUsers({
      role: role as any,
      status: status as any,
      verificationStatus: verificationStatus as any,
      search: search as string,
      city: city as string,
      sortBy: sortBy as any,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 15,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId as string;
    const result = await adminService.getUserById(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId as string;
    const updated = await adminService.updateUser(userId, req.body);
    res.status(200).json({
      message: "User profile updated successfully",
      user: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId as string;
    const { isSuspended, reason } = req.body;
    const updated = await adminService.toggleUserStatus(userId, isSuspended, reason);
    res.status(200).json({
      message: isSuspended ? "User suspended successfully" : "User reactivated successfully",
      user: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId as string;
    const requestingAdminId = req.user!.userId;
    const result = await adminService.deleteUser(userId, requestingAdminId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId as string;
    const bookings = await adminService.getUserBookings(userId);
    res.status(200).json({ bookings });
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
