import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  acceptBooking,
  declineBooking,
  completeBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";
import {
  createBookingValidationRules,
  cancelBookingValidationRules,
  bookingIdValidationRules,
  validateBookingRequest,
} from "../validations/bookingValidation.js";

const bookingRouter = Router();

bookingRouter.use(authenticateToken);

bookingRouter.post(
  "/",
  requireRole("customer", "admin"),
  createBookingValidationRules,
  validateBookingRequest,
  createBooking,
);

bookingRouter.get("/", getBookings);

bookingRouter.get("/:id", bookingIdValidationRules, validateBookingRequest, getBookingById);

bookingRouter.patch(
  "/:id/accept",
  requireRole("provider", "admin"),
  bookingIdValidationRules,
  validateBookingRequest,
  acceptBooking,
);

bookingRouter.patch(
  "/:id/decline",
  requireRole("provider", "admin"),
  bookingIdValidationRules,
  validateBookingRequest,
  declineBooking,
);

bookingRouter.patch(
  "/:id/complete",
  requireRole("customer", "admin"),
  bookingIdValidationRules,
  validateBookingRequest,
  completeBooking,
);

bookingRouter.patch(
  "/:id/cancel",
  cancelBookingValidationRules,
  validateBookingRequest,
  cancelBooking,
);

export default bookingRouter;
