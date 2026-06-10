import mongoose from "mongoose";
import BookingModel, { Booking } from "../models/Booking.js";
import UserModel from "../models/User.js";
import { recalculateProviderTrust } from "./trustScoreService.js";

export interface CreateBookingDTO {
  providerId: string;
  category: string;
  serviceDate: string;
  timeSlot: string;
  address: string;
  city?: string;
  subCity?: string;
  notes?: string;
}

export const gateBookingContacts = (booking: any, viewerId: string, viewerRole: string) => {
  const isAcceptedOrCompleted = booking.status === "accepted" || booking.status === "completed";
  const isAdmin = viewerRole === "admin";
  const isProvider =
    booking.provider?._id?.toString() === viewerId ||
    booking.provider?.id === viewerId ||
    booking.provider?.toString() === viewerId;
  const isCustomer =
    booking.customer?._id?.toString() === viewerId ||
    booking.customer?.id === viewerId ||
    booking.customer?.toString() === viewerId;

  const doc = booking.toObject ? booking.toObject({ virtuals: true }) : { ...booking };

  if (!isAcceptedOrCompleted && !isAdmin) {
    if (isCustomer && doc.provider && typeof doc.provider === "object") {
      doc.provider.phone = "";
      doc.provider.email = "";
    }
    if (isProvider && doc.customer && typeof doc.customer === "object") {
      doc.customer.phone = "";
      doc.customer.email = "";
    }
  }

  return doc;
};

export const createBooking = async (customerId: string, data: CreateBookingDTO) => {
  if (customerId === data.providerId) {
    throw Object.assign(new Error("You cannot book a service with yourself"), {
      statusCode: 400,
    });
  }

  const provider = await UserModel.findById(data.providerId);
  if (!provider || provider.role !== "provider") {
    throw Object.assign(new Error("Selected provider does not exist or is not a registered provider"), {
      statusCode: 404,
    });
  }

  const booking = await BookingModel.create({
    customer: customerId,
    provider: data.providerId,
    category: data.category,
    serviceDate: data.serviceDate,
    timeSlot: data.timeSlot,
    address: data.address,
    city: data.city || provider.location?.city || "Addis Ababa",
    subCity: data.subCity || provider.location?.subCity || "Bole",
    notes: data.notes || "",
    status: "pending",
  });

  const populated = await BookingModel.findById(booking._id)
    .populate("customer", "name username avatar email phone location")
    .populate("provider", "name username avatar email phone category hourlyRate trustScore verificationStatus location");

  return gateBookingContacts(populated, customerId, "customer");
};

export const getBookings = async (
  userId: string,
  userRole: string,
  filter: { status?: string; category?: string; page?: number; limit?: number } = {},
) => {
  const query: Record<string, any> = {};

  if (userRole === "customer") {
    query.customer = userId;
  } else if (userRole === "provider") {
    query.provider = userId;
  }

  if (filter.status) {
    if (filter.status === "active") {
      query.status = { $in: ["pending", "accepted"] };
    } else {
      query.status = filter.status;
    }
  }

  if (filter.category) {
    query.category = filter.category;
  }

  const page = Math.max(1, Number(filter.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(filter.limit) || 20));
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    BookingModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("customer", "name username avatar email phone location")
      .populate("provider", "name username avatar email phone category hourlyRate trustScore verificationStatus location"),
    BookingModel.countDocuments(query),
  ]);

  const sanitized = bookings.map((b) => gateBookingContacts(b, userId, userRole));

  return {
    bookings: sanitized,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getBookingById = async (bookingId: string, userId: string, userRole: string) => {
  const booking = await BookingModel.findById(bookingId)
    .populate("customer", "name username avatar email phone location")
    .populate("provider", "name username avatar email phone category hourlyRate trustScore verificationStatus location");

  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { statusCode: 404 });
  }

  const customerId = (booking.customer as any)?._id?.toString() || (booking.customer as any)?.id || booking.customer?.toString();
  const providerId = (booking.provider as any)?._id?.toString() || (booking.provider as any)?.id || booking.provider?.toString();

  if (userRole !== "admin" && userId !== customerId && userId !== providerId) {
    throw Object.assign(new Error("Not authorized to view this booking"), { statusCode: 403 });
  }

  return gateBookingContacts(booking, userId, userRole);
};

export const acceptBooking = async (bookingId: string, providerId: string) => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { statusCode: 404 });
  }

  if (booking.provider.toString() !== providerId) {
    throw Object.assign(new Error("Only the assigned service provider can accept this booking"), {
      statusCode: 403,
    });
  }

  if (booking.status !== "pending") {
    throw Object.assign(new Error(`Cannot accept booking with status '${booking.status}'`), {
      statusCode: 400,
    });
  }

  booking.status = "accepted";
  booking.wasAccepted = true;
  booking.acceptedAt = new Date();
  await booking.save();

  const populated = await BookingModel.findById(booking._id)
    .populate("customer", "name username avatar email phone location")
    .populate("provider", "name username avatar email phone category hourlyRate trustScore verificationStatus location");

  return gateBookingContacts(populated, providerId, "provider");
};

export const declineBooking = async (bookingId: string, providerId: string, reason?: string) => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { statusCode: 404 });
  }

  if (booking.provider.toString() !== providerId) {
    throw Object.assign(new Error("Only the assigned service provider can decline this booking"), {
      statusCode: 403,
    });
  }

  if (booking.status !== "pending") {
    throw Object.assign(new Error(`Cannot decline booking with status '${booking.status}'`), {
      statusCode: 400,
    });
  }

  booking.status = "declined";
  booking.cancelledBy = "provider";
  booking.cancellationReason = reason || "Declined by provider";
  await booking.save();

  const populated = await BookingModel.findById(booking._id)
    .populate("customer", "name username avatar email phone location")
    .populate("provider", "name username avatar email phone category hourlyRate trustScore verificationStatus location");

  return gateBookingContacts(populated, providerId, "provider");
};

export const completeBooking = async (bookingId: string, customerId: string) => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { statusCode: 404 });
  }

  if (booking.customer.toString() !== customerId) {
    throw Object.assign(
      new Error("Anti-gaming restriction: Only the customer who requested the booking has authority to mark it complete"),
      { statusCode: 403 },
    );
  }

  if (booking.status !== "accepted") {
    throw Object.assign(
      new Error(`Cannot complete a booking with status '${booking.status}'. Only accepted bookings can be marked complete.`),
      { statusCode: 400 },
    );
  }

  booking.status = "completed";
  booking.completedAt = new Date();
  await booking.save();

  await recalculateProviderTrust(booking.provider);

  const populated = await BookingModel.findById(booking._id)
    .populate("customer", "name username avatar email phone location")
    .populate("provider", "name username avatar email phone category hourlyRate trustScore verificationStatus location");

  return gateBookingContacts(populated, customerId, "customer");
};

export const cancelBooking = async (
  bookingId: string,
  userId: string,
  userRole: string,
  reason?: string,
) => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { statusCode: 404 });
  }

  if (["completed", "cancelled", "declined"].includes(booking.status)) {
    throw Object.assign(new Error(`Cannot cancel booking with status '${booking.status}'`), {
      statusCode: 400,
    });
  }

  const isCustomer = booking.customer.toString() === userId;
  const isProvider = booking.provider.toString() === userId;
  const isAdmin = userRole === "admin";

  if (!isCustomer && !isProvider && !isAdmin) {
    throw Object.assign(new Error("Not authorized to cancel this booking"), { statusCode: 403 });
  }

  const wasAccepted = booking.status === "accepted" || (booking as any).wasAccepted === true;

  if (isProvider) {
    booking.status = "cancelled";
    booking.cancelledBy = "provider";
    booking.cancellationReason = reason || "Cancelled by provider";
    await booking.save();

    if (wasAccepted) {
      await recalculateProviderTrust(booking.provider);
    }
  } else if (isCustomer) {
    booking.status = "cancelled";
    booking.cancelledBy = "customer";
    booking.cancellationReason = reason || "Cancelled by customer";
    await booking.save();
  } else {
    booking.status = "cancelled";
    booking.cancelledBy = "customer";
    booking.cancellationReason = reason || "Cancelled by administrator";
    await booking.save();
  }

  const populated = await BookingModel.findById(booking._id)
    .populate("customer", "name username avatar email phone location")
    .populate("provider", "name username avatar email phone category hourlyRate trustScore verificationStatus location");

  return gateBookingContacts(populated, userId, userRole);
};
