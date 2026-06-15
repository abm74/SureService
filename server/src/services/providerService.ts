import UserModel, { User } from "../models/User.js";
import ReviewModel from "../models/Review.js";
import BookingModel from "../models/Booking.js";
import { recalculateProviderTrust } from "./trustScoreService.js";
import { getCategoryNames } from "./categoryService.js";

export interface ProviderQueryFilters {
  category?: string;
  city?: string;
  subCity?: string;
  minScore?: number;
  maxRate?: number;
  verificationStatus?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getProviders = async (filters: ProviderQueryFilters = {}) => {
  const query: Record<string, any> = { role: "provider" };

  if (filters.category) {
    query.category = { $regex: new RegExp(`^${escapeRegex(filters.category)}$`, "i") };
  }

  if (filters.city) {
    query["location.city"] = { $regex: new RegExp(escapeRegex(filters.city), "i") };
  }

  if (filters.subCity) {
    query["location.subCity"] = { $regex: new RegExp(escapeRegex(filters.subCity), "i") };
  }

  if (filters.minScore !== undefined && !isNaN(Number(filters.minScore))) {
    query.trustScore = { $gte: Number(filters.minScore) };
  }

  if (filters.maxRate !== undefined && !isNaN(Number(filters.maxRate))) {
    query.hourlyRate = { $lte: Number(filters.maxRate) };
  }

  if (filters.verificationStatus) {
    query.verificationStatus = filters.verificationStatus;
  }

  if (filters.search && filters.search.trim()) {
    const searchRegex = new RegExp(escapeRegex(filters.search.trim()), "i");
    query.$or = [
      { name: searchRegex },
      { category: searchRegex },
      { skills: searchRegex },
      { bio: searchRegex },
      { "location.city": searchRegex },
      { "location.subCity": searchRegex },
    ];
  }

  const sortOption: Record<string, any> = {};
  switch (filters.sortBy) {
    case "hourlyRate_asc":
      sortOption.hourlyRate = 1;
      break;
    case "hourlyRate_desc":
      sortOption.hourlyRate = -1;
      break;
    case "completedJobs":
      sortOption.completedJobsCount = -1;
      break;
    case "experience":
      sortOption.experienceYears = -1;
      break;
    case "trustScore":
    default:
      sortOption.trustScore = -1;
      sortOption.completedJobsCount = -1;
      break;
  }

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(filters.limit) || 20));
  const skip = (page - 1) * limit;

  const [providers, total] = await Promise.all([
    UserModel.find(query).sort(sortOption).skip(skip).limit(limit),
    UserModel.countDocuments(query),
  ]);

  const providerIds = providers.map((p) => p._id);
  const reviewStats = await ReviewModel.aggregate([
    { $match: { provider: { $in: providerIds } } },
    {
      $group: {
        _id: "$provider",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const statsMap = new Map<string, { averageRating: number; reviewCount: number }>();
  reviewStats.forEach((stat) => {
    statsMap.set(stat._id.toString(), {
      averageRating: Math.round(stat.averageRating * 10) / 10,
      reviewCount: stat.reviewCount,
    });
  });

  const sanitized = providers.map((p) => {
    const stats = statsMap.get(p._id.toString()) || { averageRating: 0, reviewCount: 0 };
    const doc: any = p.toJSON ? p.toJSON() : { ...p };
    delete doc.phone;
    delete doc.email;
    return {
      ...doc,
      averageRating: stats.averageRating,
      reviewCount: stats.reviewCount,
    };
  });

  return {
    providers: sanitized,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getProviderById = async (
  providerId: string,
  currentUserId?: string,
  currentUserRole?: string,
) => {
  const provider = await UserModel.findOne({ _id: providerId, role: "provider" });
  if (!provider) {
    throw Object.assign(new Error("Provider not found"), { statusCode: 404 });
  }

  let hasContactAccess = false;
  if (currentUserRole === "admin" || currentUserId === providerId) {
    hasContactAccess = true;
  } else if (currentUserId) {
    const acceptedBooking = await BookingModel.findOne({
      provider: providerId,
      customer: currentUserId,
      status: { $in: ["accepted", "completed"] },
    });
    if (acceptedBooking) {
      hasContactAccess = true;
    }
  }

  const reviews = await ReviewModel.find({ provider: providerId })
    .sort({ createdAt: -1 })
    .populate("customer", "name username avatar location");

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews) * 10) / 10
      : 0;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const doc: any = provider.toJSON ? provider.toJSON() : { ...provider };
  if (!hasContactAccess) {
    delete doc.phone;
    delete doc.email;
  }

  return {
    provider: {
      ...doc,
      averageRating,
      reviewCount: totalReviews,
      ratingDistribution,
      hasContactAccess,
    },
    reviews,
  };
};

export const updateProviderProfile = async (
  providerId: string,
  data: Partial<User>,
) => {
  const provider = await UserModel.findOne({ _id: providerId, role: "provider" });
  if (!provider) {
    throw Object.assign(new Error("Provider not found"), { statusCode: 404 });
  }

  if (data.bio !== undefined) provider.bio = data.bio;
  if (data.phone !== undefined) provider.phone = data.phone;
  if (data.hourlyRate !== undefined) provider.hourlyRate = Number(data.hourlyRate);
  if (data.experienceYears !== undefined) provider.experienceYears = Number(data.experienceYears);
  if (data.skills !== undefined) provider.skills = data.skills;
  if (data.category !== undefined) provider.category = data.category;
  if (data.location) {
    const loc = data.location;
    provider.location = {
      city: loc.city || provider.location?.city || "Addis Ababa",
      subCity: loc.subCity || provider.location?.subCity || "Bole",
      address: loc.address || provider.location?.address || "",
    };
  }

  await provider.save();
  await recalculateProviderTrust(providerId);

  const updated = await UserModel.findById(providerId);
  return updated?.toJSON ? updated.toJSON() : updated;
};

export const submitVerification = async (
  providerId: string,
  docUrl: string,
  docType: string = "Kebele ID",
) => {
  const provider = await UserModel.findOne({ _id: providerId, role: "provider" });
  if (!provider) {
    throw Object.assign(new Error("Provider not found"), { statusCode: 404 });
  }

  provider.verificationDocUrl = docUrl;
  provider.verificationDocType = docType;
  provider.verificationStatus = "pending";
  provider.verificationSubmittedAt = new Date();
  provider.verificationRejectionReason = "";

  await provider.save();

  return provider.toJSON ? provider.toJSON() : provider;
};

export const getCategories = async () => {
  return getCategoryNames();
};
