import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerBookings,
  getProviderBookings,
  getBookingById,
  createBooking,
  acceptBooking,
  declineBooking,
  completeBooking,
  cancelBooking,
} from "@/services/bookingService";
import { queryKeys } from "@/constants/queryKeys";
import type { CreateBookingPayload } from "@/types";

export const useCustomerBookings = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.bookings.customer(),
    queryFn: getCustomerBookings,
    enabled,
  });
};

export const useProviderBookings = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.bookings.provider(),
    queryFn: getProviderBookings,
    enabled,
  });
};

export const useBooking = (id?: string) => {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id || ""),
    queryFn: () => getBookingById(id!),
    enabled: Boolean(id),
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
    },
  });
};

export const useAcceptBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => acceptBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
};

export const useDeclineBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => declineBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
};
