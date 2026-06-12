import api from "./api";
import type {
  User,
  ProviderDetailsResponse,
  ProviderFilters,
  UpdateProviderProfilePayload,
} from "../types";

export const getProviders = async (filters: ProviderFilters = {}): Promise<User[]> => {
  const params = new URLSearchParams();

  if (filters.category) params.append("category", filters.category);
  if (filters.city) params.append("city", filters.city);
  if (filters.subCity) params.append("subCity", filters.subCity);
  if (filters.search) params.append("search", filters.search);
  if (filters.minScore !== undefined) params.append("minScore", String(filters.minScore));
  if (filters.verificationStatus) {
    params.append("verificationStatus", filters.verificationStatus);
  } else if (filters.verifiedOnly) {
    params.append("verificationStatus", "approved");
  }
  if (filters.sortBy) params.append("sortBy", filters.sortBy);

  const queryString = params.toString();
  const url = queryString ? `/providers?${queryString}` : "/providers";

  const response = await api.get<{ providers: User[] }>(url);
  return response.data.providers;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await api.get<{ categories: string[] }>("/providers/categories");
  return response.data.categories;
};

export const getProviderById = async (id: string): Promise<ProviderDetailsResponse> => {
  const response = await api.get<ProviderDetailsResponse>(`/providers/${id}`);
  return response.data;
};

export const updateProviderProfile = async (
  payload: UpdateProviderProfilePayload,
): Promise<User> => {
  const response = await api.put<{ message: string; provider: User }>(
    "/providers/profile",
    payload,
  );
  return response.data.provider;
};

export const submitVerification = async (
  docUrl: string,
  docType: string = "National ID",
): Promise<User> => {
  const response = await api.post<{ message: string; provider: User }>(
    "/providers/verification",
    { verificationDocUrl: docUrl, verificationDocType: docType },
  );
  return response.data.provider;
};
