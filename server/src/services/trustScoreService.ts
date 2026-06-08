import mongoose from "mongoose";
import UserModel, { User } from "../models/User.js";
import BookingModel from "../models/Booking.js";

export interface TrustBreakdown {
  profileScore: number;
  verificationScore: number;
  completedJobsScore: number;
  repeatBonusScore: number;
  cancellationPenalty: number;
}

export interface TrustCalculationResult {
  trustScore: number;
  breakdown: TrustBreakdown;
}

export const computeTrustScore = (provider: Partial<User>): TrustCalculationResult => {
  let profileScore = 0;

  if (provider.bio && provider.bio.trim().length >= 30) {
    profileScore += 4;
  } else if (provider.bio && provider.bio.trim().length > 0) {
    profileScore += 2;
  }

  if (provider.category && (provider.hourlyRate ?? 0) > 0 && provider.skills && provider.skills.length > 0) {
    profileScore += 4;
  } else if (provider.category && (provider.hourlyRate ?? 0) > 0) {
    profileScore += 2;
  }

  if (provider.phone && provider.phone.trim().length >= 7 && provider.avatar) {
    profileScore += 4;
  } else if (provider.phone || provider.avatar) {
    profileScore += 2;
  }

  if (provider.location?.city) {
    profileScore += 3;
  }

  profileScore = Math.min(15, profileScore);

  const verificationScore = provider.verificationStatus === "approved" ? 25 : 0;

  const completedCount = provider.completedJobsCount || 0;
  const completedJobsScore = Math.min(35, Math.round(completedCount * 3.5 * 10) / 10);

  const repeatCount = provider.repeatCustomerCount || 0;
  const repeatBonusScore = Math.min(15, repeatCount * 5);

  const cancelledCount = provider.providerCancelledCount || 0;
  const cancellationPenalty = cancelledCount * 10;

  const rawScore = profileScore + verificationScore + completedJobsScore + repeatBonusScore - cancellationPenalty;
  const trustScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    trustScore,
    breakdown: {
      profileScore,
      verificationScore,
      completedJobsScore,
      repeatBonusScore,
      cancellationPenalty,
    },
  };
};

export const recalculateProviderTrust = async (providerId: string | mongoose.Types.ObjectId) => {
  const provider = await UserModel.findById(providerId);
  if (!provider) return null;

  const providerObjId = new mongoose.Types.ObjectId(providerId.toString());

  const completedJobsCount = await BookingModel.countDocuments({
    provider: providerObjId,
    status: "completed",
  });

  const providerCancelledCount = await BookingModel.countDocuments({
    provider: providerObjId,
    status: "cancelled",
    cancelledBy: "provider",
    wasAccepted: true,
  });

  const repeatAggregation = await BookingModel.aggregate([
    {
      $match: {
        provider: providerObjId,
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$customer",
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        count: { $gte: 2 },
      },
    },
    {
      $count: "repeatCount",
    },
  ]);

  const repeatCustomerCount = repeatAggregation[0]?.repeatCount || 0;

  provider.completedJobsCount = completedJobsCount;
  provider.providerCancelledCount = providerCancelledCount;
  provider.repeatCustomerCount = repeatCustomerCount;

  const { trustScore, breakdown } = computeTrustScore(provider);

  provider.trustScore = trustScore;
  provider.trustBreakdown = breakdown;
  await provider.save();

  return { trustScore, breakdown, completedJobsCount, repeatCustomerCount, providerCancelledCount };
};
