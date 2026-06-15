import SystemConfigModel from "../models/SystemConfig.js";

const DEFAULT_DOC_TYPES = [
  "Kebele ID",
  "National ID (Fayda)",
  "Ethiopian Trade License",
  "Driver's License",
  "Passport",
  "Professional Certification / Degree",
];

const DEFAULT_AVATAR_CONFIG = {
  baseUrl: "https://api.dicebear.com/7.x/initials/svg",
  bgColors: ["ffb545", "98fdce", "2563eb"],
};

export const getSystemConfig = async () => {
  let config = await SystemConfigModel.findOne({ key: "global" });
  if (!config) {
    config = await SystemConfigModel.create({
      key: "global",
      allowedVerificationDocTypes: DEFAULT_DOC_TYPES,
      avatarConfig: DEFAULT_AVATAR_CONFIG,
    });
  }
  return config;
};

export const getAllowedVerificationDocTypes = async (): Promise<string[]> => {
  try {
    const config = await getSystemConfig();
    return config.allowedVerificationDocTypes && config.allowedVerificationDocTypes.length > 0
      ? config.allowedVerificationDocTypes
      : DEFAULT_DOC_TYPES;
  } catch {
    return DEFAULT_DOC_TYPES;
  }
};

export const getAvatarConfig = async () => {
  try {
    const config = await getSystemConfig();
    return config.avatarConfig || DEFAULT_AVATAR_CONFIG;
  } catch {
    return DEFAULT_AVATAR_CONFIG;
  }
};
