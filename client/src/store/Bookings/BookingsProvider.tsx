import { useCallback, useState } from "react";
import BookingsContext from "./BookingsContext";
import type { Booking, CreateBookingPayload } from "../../types";
import * as bookingService from "../../services/bookingService";

export const BookingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerBookings = useCallback(async (): Promise<Booking[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getCustomerBookings();
      setBookings(data);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to load customer bookings";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProviderBookings = useCallback(async (): Promise<Booking[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getProviderBookings();
      setBookings(data);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to load provider bookings";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBookingById = useCallback(async (id: string): Promise<Booking> => {
    try {
      const booking = await bookingService.getBookingById(id);
      return booking;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to load booking";
      setError(msg);
      throw err;
    }
  }, []);

  const createBooking = useCallback(async (payload: CreateBookingPayload): Promise<Booking> => {
    setIsLoading(true);
    setError(null);
    try {
      const newBooking = await bookingService.createBooking(payload);
      setBookings((prev) => [newBooking, ...prev]);
      return newBooking;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to create booking";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptBooking = useCallback(async (id: string): Promise<Booking> => {
    setError(null);
    try {
      const updated = await bookingService.acceptBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to accept booking";
      setError(msg);
      throw err;
    }
  }, []);

  const declineBooking = useCallback(async (id: string, reason?: string): Promise<Booking> => {
    setError(null);
    try {
      const updated = await bookingService.declineBooking(id, reason);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to decline booking";
      setError(msg);
      throw err;
    }
  }, []);

  const completeBooking = useCallback(async (id: string): Promise<Booking> => {
    setError(null);
    try {
      const updated = await bookingService.completeBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to complete booking";
      setError(msg);
      throw err;
    }
  }, []);

  const cancelBooking = useCallback(
    async (id: string, cancellationReason: string = "Cancelled"): Promise<Booking> => {
      setError(null);
      try {
        const updated = await bookingService.cancelBooking(id, cancellationReason);
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        return updated;
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || "Failed to cancel booking";
        setError(msg);
        throw err;
      }
    },
    [],
  );

  const value = {
    bookings,
    isLoading,
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
