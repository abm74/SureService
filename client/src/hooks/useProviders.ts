import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getProviders,
  getProviderById,
  updateProviderProfile,
  submitVerification,
} from "@/services/providerService";
import { queryKeys } from "@/constants/queryKeys";
import type {
  ProviderFilters,
  UpdateProviderProfilePayload,
} from "@/types";

export const useProviders = (filters?: ProviderFilters) => {
  return useQuery({
    queryKey: queryKeys.providers.list(filters),
    queryFn: () => getProviders(filters),
    placeholderData: keepPreviousData,
  });
};

export const useProvider = (id?: string) => {
  return useQuery({
    queryKey: queryKeys.providers.detail(id || ""),
    queryFn: () => getProviderById(id!),
    enabled: Boolean(id),
  });
};

export const useUpdateProviderProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProviderProfilePayload) => updateProviderProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      if (updatedUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.providers.detail(updatedUser.id) });
      }
    },
  });
};

export const useSubmitVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { verificationDocUrl: string; verificationDocType?: string }) =>
      submitVerification(payload.verificationDocUrl, payload.verificationDocType),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      if (updatedUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.providers.detail(updatedUser.id) });
      }
    },
  });
};
