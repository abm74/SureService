import { useCallback, useState } from "react";
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
  useCreateBooking,
  useAcceptBooking,
  useDeclineBooking,
  useCompleteBooking,
  useCancelBooking,
} from "../../hooks/useBookings";
import { getErrorMessage } from "../../utils/helpers";

export const BookingsProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createBookingMutation = useCreateBooking();
  const acceptBookingMutation = useAcceptBooking();
  const declineBookingMutation = useDeclineBooking();
  const completeBookingMutation = useCompleteBooking();
  const cancelBookingMutation = useCancelBooking();

  const fetchCustomerBookings = useCallback(async (): Promise<Booking[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await queryClient.fetchQuery({
        queryKey: queryKeys.bookings.customer(),
        queryFn: getCustomerBookings,
      });
      setBookings(data);
      return data;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to load customer bookings.");
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const fetchProviderBookings = useCallback(async (): Promise<Booking[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await queryClient.fetchQuery({
        queryKey: queryKeys.bookings.provider(),
        queryFn: getProviderBookings,
      });
      setBookings(data);
      return data;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to load provider bookings.");
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const getBookingById = useCallback(
    async (id: string): Promise<Booking> => {
      try {
        const booking = await queryClient.fetchQuery({
          queryKey: queryKeys.bookings.detail(id),
          queryFn: () => fetchBookingByIdService(id),
        });
        return booking;
      } catch (err: unknown) {
        const msg = getErrorMessage(err, "Failed to load booking details.");
        setError(msg);
        throw err;
      }
    },
    [queryClient],
  );

  const createBooking = useCallback(
    async (payload: CreateBookingPayload): Promise<Booking> => {
      setIsLoading(true);
      setError(null);
      try {
        const newBooking = await createBookingMutation.mutateAsync(payload);
        setBookings((prev) => [newBooking, ...prev]);
        return newBooking;
      } catch (err: unknown) {
        const msg = getErrorMessage(err, "Failed to create booking request.");
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [createBookingMutation],
  );

  const acceptBooking = useCallback(
    async (id: string): Promise<Booking> => {
      setError(null);
      try {
        const updated = await acceptBookingMutation.mutateAsync(id);
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        return updated;
      } catch (err: unknown) {
        const msg = getErrorMessage(err, "Failed to accept booking.");
        setError(msg);
        throw err;
      }
    },
    [acceptBookingMutation],
  );

  const declineBooking = useCallback(
    async (id: string, reason?: string): Promise<Booking> => {
      setError(null);
      try {
        const updated = await declineBookingMutation.mutateAsync({ id, reason });
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        return updated;
      } catch (err: unknown) {
        const msg = getErrorMessage(err, "Failed to decline booking.");
        setError(msg);
        throw err;
      }
    },
    [declineBookingMutation],
  );

  const completeBooking = useCallback(
    async (id: string): Promise<Booking> => {
      setError(null);
      try {
        const updated = await completeBookingMutation.mutateAsync(id);
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        return updated;
      } catch (err: unknown) {
        const msg = getErrorMessage(err, "Failed to complete booking.");
        setError(msg);
        throw err;
      }
    },
    [completeBookingMutation],
  );

  const cancelBooking = useCallback(
    async (id: string, cancellationReason: string = "Cancelled"): Promise<Booking> => {
      setError(null);
      try {
        const updated = await cancelBookingMutation.mutateAsync({ id, reason: cancellationReason });
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        return updated;
      } catch (err: unknown) {
        const msg = getErrorMessage(err, "Failed to cancel booking.");
        setError(msg);
        throw err;
      }
    },
    [cancelBookingMutation],
  );

  const value = {
    bookings,
    isLoading: isLoading || createBookingMutation.isPending,
    error,
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
