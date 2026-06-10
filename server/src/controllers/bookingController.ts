import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import * as bookingService from "../services/bookingService.js";

export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.user!.userId;
    const { providerId, category, serviceDate, timeSlot, address, city, subCity, notes } = req.body;

    const booking = await bookingService.createBooking(customerId, {
      providerId,
      category,
      serviceDate,
      timeSlot,
      address,
      city,
      subCity,
      notes,
    });

    res.status(201).json({
      message: "Booking request created successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const { status, category, page, limit } = req.query;

    const result = await bookingService.getBookings(userId, userRole, {
      status: status as string | undefined,
      category: category as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const id = req.params.id as string;

    const booking = await bookingService.getBookingById(id, userId, userRole);
    res.status(200).json({ booking });
  } catch (error) {
    next(error);
  }
};

export const acceptBooking = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const providerId = req.user!.userId;
    const id = req.params.id as string;

    const booking = await bookingService.acceptBooking(id, providerId);
    res.status(200).json({
      message: "Booking accepted successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const declineBooking = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const providerId = req.user!.userId;
    const id = req.params.id as string;
    const { reason } = req.body;

    const booking = await bookingService.declineBooking(id, providerId, reason);
    res.status(200).json({
      message: "Booking declined",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const completeBooking = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.user!.userId;
    const id = req.params.id as string;

    const booking = await bookingService.completeBooking(id, customerId);
    res.status(200).json({
      message: "Job marked as completed. Provider trust score updated.",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const id = req.params.id as string;
    const { reason } = req.body;

    const booking = await bookingService.cancelBooking(id, userId, userRole, reason);
    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};
