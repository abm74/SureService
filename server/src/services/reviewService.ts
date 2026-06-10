import ReviewModel from "../models/Review.js";
import BookingModel from "../models/Booking.js";
import UserModel from "../models/User.js";

export const createReview = async (
  customerId: string,
  bookingId: string,
  rating: number,
  comment?: string,
) => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { statusCode: 404 });
  }

  if (booking.customer.toString() !== customerId) {
    throw Object.assign(
      new Error("Only the customer who booked the service can submit a review"),
      { statusCode: 403 },
    );
  }

  if (booking.status !== "completed") {
    throw Object.assign(
      new Error("Reviews can only be submitted for completed bookings"),
      { statusCode: 400 },
    );
  }

  const existingReview = await ReviewModel.findOne({ booking: bookingId });
  if (existingReview) {
    throw Object.assign(
      new Error("A review has already been submitted for this booking"),
      { statusCode: 409 },
    );
  }

  const review = await ReviewModel.create({
    booking: bookingId,
    customer: customerId,
    provider: booking.provider,
    rating,
    comment: comment || "",
  });

  const populated = await ReviewModel.findById(review._id)
    .populate("customer", "name username avatar location")
    .populate("provider", "name username avatar category");

  return populated;
};

export const getReviewsForProvider = async (
  providerId: string,
  page: number = 1,
  limit: number = 20,
) => {
  const provider = await UserModel.findById(providerId);
  if (!provider) {
    throw Object.assign(new Error("Provider not found"), { statusCode: 404 });
  }

  const query = { provider: providerId };
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit));
  const skip = (safePage - 1) * safeLimit;

  const [reviews, total, allReviews] = await Promise.all([
    ReviewModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("customer", "name username avatar location"),
    ReviewModel.countDocuments(query),
    ReviewModel.find(query).select("rating"),
  ]);

  const averageRating =
    allReviews.length > 0
      ? Math.round((allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length) * 10) / 10
      : 0;

  const ratingDistribution = {
    5: allReviews.filter((r) => r.rating === 5).length,
    4: allReviews.filter((r) => r.rating === 4).length,
    3: allReviews.filter((r) => r.rating === 3).length,
    2: allReviews.filter((r) => r.rating === 2).length,
    1: allReviews.filter((r) => r.rating === 1).length,
  };

  return {
    reviews,
    total,
    page: safePage,
    totalPages: Math.ceil(total / safeLimit),
    averageRating,
    ratingDistribution,
  };
};
