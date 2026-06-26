import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getPlatformStats,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  getUsers,
  getUserDetails,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getUserBookings,
} from "@/services/adminService";
import { queryKeys } from "@/constants/queryKeys";
import type { AdminUserFilters, AdminUpdateUserPayload } from "@/types";

export const usePlatformStats = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: getPlatformStats,
    enabled,
  });
};

export const usePendingVerifications = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.admin.verifications(),
    queryFn: getPendingVerifications,
    enabled,
  });
};

export const useApproveVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (providerId: string) => approveVerification(providerId),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
      if (updatedUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.providers.detail(updatedUser.id) });
      }
    },
  });
};

export const useRejectVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ providerId, reason }: { providerId: string; reason: string }) =>
      rejectVerification(providerId, reason),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
      if (updatedUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.providers.detail(updatedUser.id) });
      }
    },
  });
};

export const useAdminUsers = (filters: AdminUserFilters = {}, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.admin.userList(filters),
    queryFn: () => getUsers(filters),
    placeholderData: keepPreviousData,
    enabled,
  });
};

export const useAdminUserDetails = (userId: string | null) => {
  return useQuery({
    queryKey: queryKeys.admin.userDetail(userId || ""),
    queryFn: () => getUserDetails(userId!),
    enabled: Boolean(userId),
  });
};

export const useAdminUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: AdminUpdateUserPayload }) =>
      updateUser(userId, payload),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
      if (updatedUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.userDetail(updatedUser.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.providers.detail(updatedUser.id) });
      }
    },
  });
};

export const useAdminToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      isSuspended,
      reason,
    }: {
      userId: string;
      isSuspended: boolean;
      reason?: string;
    }) => toggleUserStatus(userId, isSuspended, reason),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
      if (updatedUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.userDetail(updatedUser.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.providers.detail(updatedUser.id) });
      }
    },
  });
};

export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
};

export const useAdminUserBookings = (userId: string | null) => {
  return useQuery({
    queryKey: queryKeys.admin.userBookings(userId || ""),
    queryFn: () => getUserBookings(userId!),
    enabled: Boolean(userId),
  });
};
