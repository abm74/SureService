import api from "./api";
import type { User, PlatformStats } from "../types";

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
