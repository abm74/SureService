import UserModel, { UserRole, VerificationStatus } from "../models/User.js";
import BookingModel from "../models/Booking.js";
import ReviewModel from "../models/Review.js";
import { RefreshTokenModel } from "../models/RefreshToken.js";
import { recalculateProviderTrust } from "./trustScoreService.js";
import { sanitizeUser } from "./authService.js";

export interface GetUsersParams {
  role?: "all" | "customer" | "provider" | "admin";
  status?: "all" | "active" | "suspended";
  verificationStatus?: "all" | "approved" | "pending" | "rejected" | "unverified";
  search?: string;
  city?: string;
  sortBy?: "newest" | "oldest" | "nameAsc" | "nameDesc" | "trustScore" | "completedJobs";
  page?: number;
  limit?: number;
}

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getUsers = async (params: GetUsersParams = {}) => {
  const {
    role = "all",
    status = "all",
    verificationStatus = "all",
    search = "",
    city = "",
    sortBy = "newest",
    page = 1,
    limit = 15,
  } = params;

  const query: Record<string, any> = {};

  if (role && role !== "all") {
    query.role = role;
  }

  if (status === "active") {
    query.isSuspended = { $ne: true };
    query.isActive = { $ne: false };
  } else if (status === "suspended") {
    query.$or = [{ isSuspended: true }, { isActive: false }];
  }

  if (verificationStatus && verificationStatus !== "all") {
    query.verificationStatus = verificationStatus;
  }

  if (city && city.trim()) {
    query["location.city"] = { $regex: escapeRegex(city.trim()), $options: "i" };
  }

  if (search && search.trim()) {
    const term = escapeRegex(search.trim());
    const searchConditions = [
      { name: { $regex: term, $options: "i" } },
      { username: { $regex: term, $options: "i" } },
      { email: { $regex: term, $options: "i" } },
      { phone: { $regex: term, $options: "i" } },
      { category: { $regex: term, $options: "i" } },
    ];

    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: searchConditions }];
      delete query.$or;
    } else {
      query.$or = searchConditions;
    }
  }

  const sortOptions: Record<string, any> = {};
  switch (sortBy) {
    case "oldest":
      sortOptions.createdAt = 1;
      break;
    case "nameAsc":
      sortOptions.name = 1;
      break;
    case "nameDesc":
      sortOptions.name = -1;
      break;
    case "trustScore":
      sortOptions.trustScore = -1;
      break;
    case "completedJobs":
      sortOptions.completedJobsCount = -1;
      break;
    case "newest":
    default:
      sortOptions.createdAt = -1;
      break;
  }

  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit));
  const skip = (safePage - 1) * safeLimit;

  const [users, total, totalCustomers, totalProviders, totalAdmins, totalSuspended] =
    await Promise.all([
      UserModel.find(query).sort(sortOptions).skip(skip).limit(safeLimit),
      UserModel.countDocuments(query),
      UserModel.countDocuments({ role: "customer" }),
      UserModel.countDocuments({ role: "provider" }),
      UserModel.countDocuments({ role: "admin" }),
      UserModel.countDocuments({ $or: [{ isSuspended: true }, { isActive: false }] }),
    ]);

  return {
    users: users.map((u) => sanitizeUser(u)),
    total,
    page: safePage,
    totalPages: Math.ceil(total / safeLimit),
    counts: {
      total: totalCustomers + totalProviders + totalAdmins,
      customers: totalCustomers,
      providers: totalProviders,
      admins: totalAdmins,
      suspended: totalSuspended,
    },
  };
};

export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const [
    totalBookingsCustomer,
    totalBookingsProvider,
    completedBookings,
    activeBookings,
    cancelledBookings,
    reviews,
  ] = await Promise.all([
    BookingModel.countDocuments({ customer: userId }),
    BookingModel.countDocuments({ provider: userId }),
    BookingModel.countDocuments({
      $or: [{ customer: userId }, { provider: userId }],
      status: "completed",
    }),
    BookingModel.countDocuments({
      $or: [{ customer: userId }, { provider: userId }],
      status: { $in: ["pending", "accepted"] },
    }),
    BookingModel.countDocuments({
      $or: [{ customer: userId }, { provider: userId }],
      status: "cancelled",
    }),
    user.role === "provider"
      ? ReviewModel.find({ provider: userId }).sort({ createdAt: -1 }).limit(10).lean()
      : Promise.resolve([]),
  ]);

  const avgRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  return {
    user: sanitizeUser(user),
    stats: {
      totalBookingsCustomer,
      totalBookingsProvider,
      completedBookings,
      activeBookings,
      cancelledBookings,
      reviewCount: reviews.length,
      averageRating: avgRating,
    },
    recentReviews: reviews,
  };
};

export const updateUser = async (userId: string, updateData: Record<string, any>) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  if (updateData.email && updateData.email.toLowerCase() !== user.email.toLowerCase()) {
    const existing = await UserModel.findOne({
      email: updateData.email.toLowerCase(),
      _id: { $ne: userId },
    });
    if (existing) {
      throw Object.assign(new Error("Email is already taken by another account"), {
        statusCode: 409,
      });
    }
    user.email = updateData.email.toLowerCase();
  }

  if (updateData.username && updateData.username.toLowerCase() !== user.username.toLowerCase()) {
    const existing = await UserModel.findOne({
      username: updateData.username.toLowerCase(),
      _id: { $ne: userId },
    });
    if (existing) {
      throw Object.assign(new Error("Username is already taken by another account"), {
        statusCode: 409,
      });
    }
    user.username = updateData.username.toLowerCase();
  }

  if (updateData.name !== undefined) user.name = updateData.name;
  if (updateData.phone !== undefined) user.phone = updateData.phone;
  if (updateData.bio !== undefined) user.bio = updateData.bio;
  if (updateData.avatar !== undefined) user.avatar = updateData.avatar;
  if (updateData.role !== undefined) user.role = updateData.role as UserRole;

  if (updateData.category !== undefined) user.category = updateData.category;
  if (updateData.hourlyRate !== undefined) user.hourlyRate = Number(updateData.hourlyRate);
  if (updateData.experienceYears !== undefined)
    user.experienceYears = Number(updateData.experienceYears);
  if (Array.isArray(updateData.skills)) user.skills = updateData.skills;

  if (updateData.location) {
    user.location = {
      city: updateData.location.city || user.location?.city || "Addis Ababa",
      subCity: updateData.location.subCity || user.location?.subCity || "Bole",
      address: updateData.location.address ?? user.location?.address ?? "",
    };
  }

  if (updateData.verificationStatus !== undefined) {
    user.verificationStatus = updateData.verificationStatus as VerificationStatus;
    if (updateData.verificationStatus === "approved") {
      user.verificationReviewedAt = new Date();
      user.verificationRejectionReason = "";
    } else if (updateData.verificationStatus === "rejected") {
      user.verificationReviewedAt = new Date();
      user.verificationRejectionReason = updateData.verificationRejectionReason || "Requirements not met";
    }
  }

  await user.save();

  if (user.role === "provider") {
    await recalculateProviderTrust(userId);
  }

  const updated = await UserModel.findById(userId);
  return sanitizeUser(updated);
};

export const toggleUserStatus = async (
  userId: string,
  isSuspended: boolean,
  reason: string = "",
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  user.isSuspended = Boolean(isSuspended);
  user.isActive = !isSuspended;
  user.suspensionReason = isSuspended ? reason.trim() : "";
  user.suspendedAt = isSuspended ? new Date() : null;

  await user.save();

  if (isSuspended) {
    await RefreshTokenModel.deleteMany({ userId: user._id.toString() });
  }

  return sanitizeUser(user);
};

export const deleteUser = async (userId: string, requestingAdminId: string) => {
  if (userId === requestingAdminId) {
    throw Object.assign(new Error("Administrators cannot delete their own account"), {
      statusCode: 400,
    });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  await BookingModel.updateMany(
    {
      $or: [{ customer: userId }, { provider: userId }],
      status: { $in: ["pending", "accepted"] },
    },
    {
      $set: {
        status: "cancelled",
        cancellationReason: "Account closed by platform administrator",
      },
    },
  );

  await RefreshTokenModel.deleteMany({ userId });
  await UserModel.findByIdAndDelete(userId);

  return { message: "User deleted successfully", userId };
};

export const getUserBookings = async (userId: string) => {
  const bookings = await BookingModel.find({
    $or: [{ customer: userId }, { provider: userId }],
  })
    .populate("customer", "name username email phone avatar role")
    .populate("provider", "name username email phone avatar role category trustScore")
    .sort({ createdAt: -1 })
    .limit(50);

  return bookings.map((b) => (b.toJSON ? b.toJSON() : b));
};

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
  return updated ? sanitizeUser(updated) : null;
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
  return updated ? sanitizeUser(updated) : null;
};

export const getPlatformStats = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalProviders,
    verifiedProviders,
    pendingVerifications,
    totalBookings,
    completedBookings,
    activeBookings,
    avgScoreAgg,
  ] = await Promise.all([
    UserModel.countDocuments(),
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
    totalUsers,
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
