import api from "./api";
import type { Review, CreateReviewPayload } from "../types";

export const createReview = async (payload: CreateReviewPayload): Promise<Review> => {
  const response = await api.post<{ message: string; review: Review }>(
    "/reviews",
    payload,
  );
  return response.data.review;
};

export const getProviderReviews = async (providerId: string): Promise<Review[]> => {
  const response = await api.get<{ reviews: Review[] }>(
    `/reviews/provider/${providerId}`,
  );
  return response.data.reviews;
};
