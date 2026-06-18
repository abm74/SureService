import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/services/reviewService";
import { queryKeys } from "@/constants/queryKeys";
import type { CreateReviewPayload } from "@/types";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
};
