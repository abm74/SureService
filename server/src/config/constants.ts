export const USER_ROLES = ["customer", "provider", "admin"] as const;
export type UserRoleType = (typeof USER_ROLES)[number];
