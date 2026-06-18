import type { ProviderFilters, AdminUserFilters } from "../types";

export const queryKeys = {
  categories: {
    all: ["categories"] as const,
  },
  locations: {
    all: ["locations"] as const,
  },
  providers: {
    all: ["providers"] as const,
    lists: () => [...queryKeys.providers.all, "list"] as const,
    list: (filters?: ProviderFilters) => [...queryKeys.providers.lists(), filters] as const,
    details: () => [...queryKeys.providers.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.providers.details(), id] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    customer: () => [...queryKeys.bookings.all, "customer"] as const,
    provider: () => [...queryKeys.bookings.all, "provider"] as const,
    detail: (id: string) => [...queryKeys.bookings.all, "detail", id] as const,
  },
  admin: {
    all: ["admin"] as const,
    stats: () => [...queryKeys.admin.all, "stats"] as const,
    verifications: () => [...queryKeys.admin.all, "verifications"] as const,
    users: () => [...queryKeys.admin.all, "users"] as const,
    userList: (filters?: AdminUserFilters) => [...queryKeys.admin.users(), filters] as const,
    userDetail: (id: string) => [...queryKeys.admin.all, "user", id] as const,
    userBookings: (id: string) => [...queryKeys.admin.all, "user-bookings", id] as const,
  },
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
    demoStatus: () => [...queryKeys.auth.all, "demo-status"] as const,
  },
};
