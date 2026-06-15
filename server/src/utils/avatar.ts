export interface AvatarConfigOptions {
  baseUrl?: string;
  bgColors?: string[];
}

export const generateDefaultAvatar = (
  nameOrUsername?: string,
  customConfig?: AvatarConfigOptions,
): string => {
  const baseUrl =
    customConfig?.baseUrl || "https://api.dicebear.com/7.x/initials/svg";
  const bgColors = customConfig?.bgColors?.join(",") || "ffb545,98fdce,2563eb";
  const seed = encodeURIComponent(nameOrUsername || "User");
  return `${baseUrl}?seed=${seed}&backgroundColor=${bgColors}`;
};
