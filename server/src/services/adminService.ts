import UserModel, { UserRole, VerificationStatus } from "../models/User.js";
import BookingModel from "../models/Booking.js";
import { recalculateProviderTrust } from "./trustScoreService.js";

export const getPendingVerifications = async (page: number = 1, limit: number = 20) => {
  const query: Record<string, any> = { role: "provider", verificationStatus: "pending" };
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit));
  const skip = (safePage - 1) * safeLimit;

  const [verifications, total] = await Promise.all([
    UserModel.find(query)
      .sort({ verificationSubmittedAt: 1, createdAt: 1 })
      .skip(skip)
      .limit(safeLimit),
    UserModel.countDocuments(query),
  ]);

  return {
    verifications: verifications.map((v) => (v.toJSON ? v.toJSON() : v)),
    total,
    page: safePage,
    totalPages: Math.ceil(total / safeLimit),
  };
};

export const approveVerification = async (providerId: string) => {
  const provider = await UserModel.findOne({ _id: providerId, role: "provider" });
  if (!provider) {
    throw Object.assign(new Error("Provider not found"), { statusCode: 404 });
  }

  provider.verificationStatus = "approved";
  provider.verificationReviewedAt = new Date();
  provider.verificationRejectionReason = "";
  await provider.save();

  await recalculateProviderTrust(providerId);

  const updated = await UserModel.findById(providerId);
  return updated?.toJSON ? updated.toJSON() : updated;
};

export const rejectVerification = async (providerId: string, reason: string) => {
  const provider = await UserModel.findOne({ _id: providerId, role: "provider" });
  if (!provider) {
    throw Object.assign(new Error("Provider not found"), { statusCode: 404 });
  }

  provider.verificationStatus = "rejected";
  provider.verificationReviewedAt = new Date();
  provider.verificationRejectionReason = reason;
  await provider.save();

  await recalculateProviderTrust(providerId);

  const updated = await UserModel.findById(providerId);
  return updated?.toJSON ? updated.toJSON() : updated;
};

export const getPlatformStats = async () => {
  const [
    totalCustomers,
    totalProviders,
    verifiedProviders,
    pendingVerifications,
    totalBookings,
    completedBookings,
    activeBookings,
    avgScoreAgg,
  ] = await Promise.all([
    UserModel.countDocuments({ role: "customer" }),
    UserModel.countDocuments({ role: "provider" }),
    UserModel.countDocuments({ role: "provider", verificationStatus: "approved" }),
    UserModel.countDocuments({ role: "provider", verificationStatus: "pending" }),
    BookingModel.countDocuments(),
    BookingModel.countDocuments({ status: "completed" }),
    BookingModel.countDocuments({ status: { $in: ["pending", "accepted"] } }),
    UserModel.aggregate([
      { $match: { role: "provider" } },
      { $group: { _id: null, avgScore: { $avg: "$trustScore" } } },
    ]),
  ]);

  const averageTrustScore = avgScoreAgg[0]?.avgScore
    ? Math.round(avgScoreAgg[0].avgScore * 10) / 10
    : 0;

  return {
    totalCustomers,
    totalProviders,
    verifiedProviders,
    pendingVerifications,
    totalBookings,
    completedBookings,
    activeBookings,
    averageTrustScore,
  };
};
