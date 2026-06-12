import api from "./api";
import type { Booking, CreateBookingPayload } from "../types";

export const createBooking = async (payload: CreateBookingPayload): Promise<Booking> => {
  const response = await api.post<{ message: string; booking: Booking }>(
    "/bookings",
    payload,
  );
  return response.data.booking;
};

export const getCustomerBookings = async (): Promise<Booking[]> => {
  const response = await api.get<{ bookings: Booking[] }>("/bookings");
  return response.data.bookings;
};

export const getProviderBookings = async (): Promise<Booking[]> => {
  const response = await api.get<{ bookings: Booking[] }>("/bookings");
  return response.data.bookings;
};

export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await api.get<{ booking: Booking }>(`/bookings/${id}`);
  return response.data.booking;
};

export const acceptBooking = async (bookingId: string): Promise<Booking> => {
  const response = await api.patch<{ message: string; booking: Booking }>(
    `/bookings/${bookingId}/accept`,
  );
  return response.data.booking;
};

export const declineBooking = async (
  bookingId: string,
  reason?: string,
): Promise<Booking> => {
  const response = await api.patch<{ message: string; booking: Booking }>(
    `/bookings/${bookingId}/decline`,
    { reason },
  );
  return response.data.booking;
};

export const completeBooking = async (bookingId: string): Promise<Booking> => {
  const response = await api.patch<{ message: string; booking: Booking }>(
    `/bookings/${bookingId}/complete`,
  );
  return response.data.booking;
};

export const cancelBooking = async (
  bookingId: string,
  reason?: string,
): Promise<Booking> => {
  const response = await api.patch<{ message: string; booking: Booking }>(
    `/bookings/${bookingId}/cancel`,
    { reason },
  );
  return response.data.booking;
};
