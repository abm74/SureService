import { createContext, useContext } from "react";
import type { Booking, CreateBookingPayload } from "../../types";

export type BookingsContextType = {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchCustomerBookings: () => Promise<Booking[]>;
  fetchProviderBookings: () => Promise<Booking[]>;
  getBookingById: (id: string) => Promise<Booking>;
  createBooking: (payload: CreateBookingPayload) => Promise<Booking>;
  acceptBooking: (id: string) => Promise<Booking>;
  declineBooking: (id: string, reason?: string) => Promise<Booking>;
  completeBooking: (id: string) => Promise<Booking>;
  cancelBooking: (id: string, cancellationReason?: string) => Promise<Booking>;
};

const BookingsContext = createContext<BookingsContextType>({
  bookings: [],
  isLoading: false,
  error: null,
  fetchCustomerBookings: async () => [],
  fetchProviderBookings: async () => [],
  getBookingById: async () => {
    throw new Error("getBookingById not implemented");
  },
  createBooking: async () => {
    throw new Error("createBooking not implemented");
  },
  acceptBooking: async () => {
    throw new Error("acceptBooking not implemented");
  },
  declineBooking: async () => {
    throw new Error("declineBooking not implemented");
  },
  completeBooking: async () => {
    throw new Error("completeBooking not implemented");
  },
  cancelBooking: async () => {
    throw new Error("cancelBooking not implemented");
  },
});

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingsProvider");
  }
  return context;
};

export default BookingsContext;
