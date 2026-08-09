import { useCallback } from "react";
import BookingsContext from "./BookingsContext";
import type { Booking, CreateBookingPayload } from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys";
import {
  getCustomerBookings,
  getProviderBookings,
  getBookingById as fetchBookingByIdService,
} from "../../services/bookingService";
import {
  useCustomerBookings,
  useProviderBookings,
  useCreateBooking,
  useAcceptBooking,
  useDeclineBooking,
  useCompleteBooking,
  useCancelBooking,
} from "../../hooks/useBookings";
import { useAuth } from "../Auth/AuthContext";
import { getErrorMessage } from "../../utils/helpers";

export const BookingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const isProvider = user?.role === "provider";

  const customerQuery = useCustomerBookings(Boolean(isAuthenticated && !isProvider));
  const providerQuery = useProviderBookings(Boolean(isAuthenticated && isProvider));

  const activeQuery = isProvider ? providerQuery : customerQuery;

  const createBookingMutation = useCreateBooking();
  const acceptBookingMutation = useAcceptBooking();
  const declineBookingMutation = useDeclineBooking();
  const completeBookingMutation = useCompleteBooking();
  const cancelBookingMutation = useCancelBooking();

  const fetchCustomerBookings = useCallback(async (): Promise<Booking[]> => {
    return await queryClient.fetchQuery({
      queryKey: queryKeys.bookings.customer(),
      queryFn: getCustomerBookings,
    });
  }, [queryClient]);

  const fetchProviderBookings = useCallback(async (): Promise<Booking[]> => {
    return await queryClient.fetchQuery({
      queryKey: queryKeys.bookings.provider(),
      queryFn: getProviderBookings,
    });
  }, [queryClient]);

  const getBookingById = useCallback(
    async (id: string): Promise<Booking> => {
      return await queryClient.fetchQuery({
        queryKey: queryKeys.bookings.detail(id),
        queryFn: () => fetchBookingByIdService(id),
      });
    },
    [queryClient],
  );

  const createBooking = useCallback(
    async (payload: CreateBookingPayload): Promise<Booking> => {
      return await createBookingMutation.mutateAsync(payload);
    },
    [createBookingMutation],
  );

  const acceptBooking = useCallback(
    async (id: string): Promise<Booking> => {
      return await acceptBookingMutation.mutateAsync(id);
    },
    [acceptBookingMutation],
  );

  const declineBooking = useCallback(
    async (id: string, reason?: string): Promise<Booking> => {
      return await declineBookingMutation.mutateAsync({ id, reason });
    },
    [declineBookingMutation],
  );

  const completeBooking = useCallback(
    async (id: string): Promise<Booking> => {
      return await completeBookingMutation.mutateAsync(id);
    },
    [completeBookingMutation],
  );

  const cancelBooking = useCallback(
    async (id: string, cancellationReason: string = "Cancelled"): Promise<Booking> => {
      return await cancelBookingMutation.mutateAsync({ id, reason: cancellationReason });
    },
    [cancelBookingMutation],
  );

  const isMutating =
    createBookingMutation.isPending ||
    acceptBookingMutation.isPending ||
    declineBookingMutation.isPending ||
    completeBookingMutation.isPending ||
    cancelBookingMutation.isPending;

  const mutationError =
    createBookingMutation.error ||
    acceptBookingMutation.error ||
    declineBookingMutation.error ||
    completeBookingMutation.error ||
    cancelBookingMutation.error;

  const currentError = activeQuery.error || mutationError;

  const value = {
    bookings: activeQuery.data ?? [],
    isLoading: activeQuery.isLoading || isMutating,
    error: currentError ? getErrorMessage(currentError) : null,
    fetchCustomerBookings,
    fetchProviderBookings,
    getBookingById,
    createBooking,
    acceptBooking,
    declineBooking,
    completeBooking,
    cancelBooking,
  };

  return <BookingsContext value={value}>{children}</BookingsContext>;
};

export default BookingsProvider;
