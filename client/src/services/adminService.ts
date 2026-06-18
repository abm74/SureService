import api from "./api";
import type {
  User,
  PlatformStats,
  AdminUserFilters,
  AdminUsersResponse,
  AdminUserDetailsResponse,
  AdminUpdateUserPayload,
  Booking,
} from "../types";

export const getPendingVerifications = async (): Promise<User[]> => {
  const response = await api.get<{ verifications: User[] }>("/admin/verifications");
  return response.data.verifications;
};

export const approveVerification = async (providerId: string): Promise<User> => {
  const response = await api.patch<{ message: string; provider: User }>(
    `/admin/verifications/${providerId}/approve`,
  );
  return response.data.provider;
};

export const rejectVerification = async (
  providerId: string,
  reason: string,
): Promise<User> => {
  const response = await api.patch<{ message: string; provider: User }>(
    `/admin/verifications/${providerId}/reject`,
    { reason },
  );
  return response.data.provider;
};

export const getPlatformStats = async (): Promise<PlatformStats> => {
  const response = await api.get<{ stats: PlatformStats }>("/admin/stats");
  return response.data.stats;
};

export const getUsers = async (filters: AdminUserFilters = {}): Promise<AdminUsersResponse> => {
  const params = new URLSearchParams();
  if (filters.role && filters.role !== "all") params.append("role", filters.role);
  if (filters.status && filters.status !== "all") params.append("status", filters.status);
  if (filters.verificationStatus && filters.verificationStatus !== "all")
    params.append("verificationStatus", filters.verificationStatus);
  if (filters.search) params.append("search", filters.search);
  if (filters.city) params.append("city", filters.city);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));

  const response = await api.get<AdminUsersResponse>(`/admin/users?${params.toString()}`);
  return response.data;
};

export const getUserDetails = async (userId: string): Promise<AdminUserDetailsResponse> => {
  const response = await api.get<AdminUserDetailsResponse>(`/admin/users/${userId}`);
  return response.data;
};

export const updateUser = async (
  userId: string,
  payload: AdminUpdateUserPayload,
): Promise<User> => {
  const response = await api.patch<{ message: string; user: User }>(
    `/admin/users/${userId}`,
    payload,
  );
  return response.data.user;
};

export const toggleUserStatus = async (
  userId: string,
  isSuspended: boolean,
  reason?: string,
): Promise<User> => {
  const response = await api.patch<{ message: string; user: User }>(
    `/admin/users/${userId}/status`,
    { isSuspended, reason },
  );
  return response.data.user;
};

export const deleteUser = async (
  userId: string,
): Promise<{ message: string; userId: string }> => {
  const response = await api.delete<{ message: string; userId: string }>(
    `/admin/users/${userId}`,
  );
  return response.data;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const response = await api.get<{ bookings: Booking[] }>(`/admin/users/${userId}/bookings`);
  return response.data.bookings;
};
