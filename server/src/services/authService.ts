import UserModel, { User, UserRole } from "../models/User.js";
import jwt from "jsonwebtoken";
import { RefreshTokenModel } from "../models/RefreshToken.js";
import { UserPayload } from "../middleware/authMiddleware.js";
import { computeTrustScore } from "./trustScoreService.js";

const accessTokenExpirySeconds = () =>
  Number(process.env.ACCESS_TOKEN_EXPIRESIN) || 900;

const refreshTokenExpirySeconds = () =>
  Number(process.env.REFRESH_TOKEN_EXPIRESIN) || 604800;

const generateTokens = (payload: UserPayload) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    console.error("Critical: ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET environment variable is missing.");
    throw Object.assign(new Error("JWT configuration missing on server"), { statusCode: 500 });
  }

  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpirySeconds(),
  });
  const refreshToken = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenExpirySeconds(),
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (token: string, userId: string) => {
  await RefreshTokenModel.create({
    token,
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + refreshTokenExpirySeconds() * 1000),
  });
};

export const sanitizeUser = (user: any) => ({
  id: user._id?.toString() || user.id,
  name: user.name || user.username,
  username: user.username,
  email: user.email,
  role: user.role as UserRole,
  avatar: user.avatar,
  phone: user.phone || "",
  bio: user.bio || "",
  location: user.location || { city: "Addis Ababa", subCity: "Bole" },
  category: user.category || "",
  hourlyRate: user.hourlyRate || 0,
  experienceYears: user.experienceYears || 0,
  skills: user.skills || [],
  verificationStatus: user.verificationStatus || "unverified",
  verificationDocUrl: user.verificationDocUrl || "",
  verificationDocType: user.verificationDocType || "Kebele ID",
  verificationRejectionReason: user.verificationRejectionReason || "",
  trustScore: user.trustScore ?? 15,
  trustBreakdown: user.trustBreakdown || {
    profileScore: 15,
    verificationScore: 0,
    completedJobsScore: 0,
    repeatBonusScore: 0,
    cancellationPenalty: 0,
  },
  completedJobsCount: user.completedJobsCount || 0,
  repeatCustomerCount: user.repeatCustomerCount || 0,
  providerCancelledCount: user.providerCancelledCount || 0,
  isActive: user.isActive !== false,
  isSuspended: Boolean(user.isSuspended),
  suspensionReason: user.suspensionReason || "",
  suspendedAt: user.suspendedAt || null,
  createdAt: user.createdAt || null,
});

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw Object.assign(new Error("Email and password are required"), {
      statusCode: 400,
    });
  }

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  }

  const passwordMatch = await user.verifyPassword(password);
  if (!passwordMatch) {
    throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  }

  if (user.isSuspended || user.isActive === false) {
    const msg = user.suspensionReason
      ? `Your account has been suspended: ${user.suspensionReason}`
      : "Your account has been suspended by an administrator.";
    throw Object.assign(new Error(msg), { statusCode: 403 });
  }

  const payload: UserPayload = {
    userId: user._id.toString(),
    role: user.role as UserRole,
  };
  const { accessToken, refreshToken } = generateTokens(payload);

  await storeRefreshToken(refreshToken, user._id.toString());

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const signupUser = async (
  name: string,
  username: string,
  email: string,
  password: string,
  role: UserRole = "customer",
  extraProfileData: Partial<User> = {},
) => {
  if (!name || !username || !email || !password) {
    throw Object.assign(
      new Error("Name, username, email and password are required"),
      { statusCode: 400 },
    );
  }

  const existingEmail = await UserModel.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw Object.assign(new Error("Email already registered"), { statusCode: 409 });
  }

  const existingUsername = await UserModel.findOne({ username: username.toLowerCase() });
  if (existingUsername) {
    throw Object.assign(new Error("Username already taken"), { statusCode: 409 });
  }

  const initialTrust = role === "provider" ? computeTrustScore({ ...extraProfileData, bio: extraProfileData.bio || "" }) : { trustScore: 15, breakdown: { profileScore: 15, verificationScore: 0, completedJobsScore: 0, repeatBonusScore: 0, cancellationPenalty: 0 } };

  const user = await UserModel.create({
    name,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role,
    ...extraProfileData,
    trustScore: initialTrust.trustScore,
    trustBreakdown: initialTrust.breakdown,
  });

  const payload: UserPayload = {
    userId: user._id.toString(),
    role: user.role as UserRole,
  };
  const { accessToken, refreshToken } = generateTokens(payload);

  await storeRefreshToken(refreshToken, user._id.toString());

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const refreshUserToken = async (oldRefreshToken: string) => {
  if (!oldRefreshToken) {
    throw Object.assign(new Error("Refresh token missing"), {
      statusCode: 401,
    });
  }

  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    throw Object.assign(new Error("JWT configuration missing on server"), { statusCode: 500 });
  }

  let decoded: UserPayload;
  try {
    decoded = jwt.verify(
      oldRefreshToken,
      refreshTokenSecret,
    ) as UserPayload;
  } catch (err) {
    await RefreshTokenModel.deleteOne({ token: oldRefreshToken });
    throw err;
  }

  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  if (user.isSuspended || user.isActive === false) {
    await RefreshTokenModel.deleteMany({ userId: user._id.toString() });
    throw Object.assign(new Error("Your account has been suspended by an administrator."), {
      statusCode: 403,
    });
  }

  const storedRefreshToken = await RefreshTokenModel.findOne({
    token: oldRefreshToken,
  });
  if (!storedRefreshToken) {
    throw Object.assign(new Error("Invalid refresh token"), {
      statusCode: 401,
    });
  }

  await storedRefreshToken.deleteOne();

  const payload: UserPayload = {
    userId: decoded.userId,
    role: user.role as UserRole,
  };
  const { accessToken, refreshToken } = generateTokens(payload);

  await storeRefreshToken(refreshToken, decoded.userId);

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const logoutUser = async (refreshToken: string | undefined) => {
  if (refreshToken) {
    await RefreshTokenModel.findOneAndDelete({ token: refreshToken });
  }
};

export const getCurrentUser = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }
  return sanitizeUser(user);
};

export const demoLoginUser = async (requestedRole: UserRole = "customer") => {
  const val = process.env.ENABLE_DEMO_LOGIN?.trim().toLowerCase();
  const isDemoEnabled = val === "true" || val === "1" || val === "yes";

  if (!isDemoEnabled) {
    throw Object.assign(
      new Error("Demo logins are disabled in this environment."),
      { statusCode: 403 },
    );
  }

  const envEmailMap: Partial<Record<UserRole, string | undefined>> = {
    customer: process.env.DEMO_CUSTOMER_EMAIL,
    provider: process.env.DEMO_PROVIDER_EMAIL,
    admin: process.env.DEMO_ADMIN_EMAIL,
  };

  const configuredEmail = envEmailMap[requestedRole];
  let user = configuredEmail
    ? await UserModel.findOne({ email: configuredEmail, isSuspended: { $ne: true } })
    : null;

  if (!user) {
    user = await UserModel.findOne({ role: requestedRole, isSuspended: { $ne: true } });
  }

  if (!user) {
    throw Object.assign(
      new Error(`Demo account for role '${requestedRole}' not found. Please seed the database.`),
      { statusCode: 404 },
    );
  }

  const payload: UserPayload = {
    userId: user._id.toString(),
    role: user.role as UserRole,
  };
  const { accessToken, refreshToken } = generateTokens(payload);

  await storeRefreshToken(refreshToken, user._id.toString());

  return { user: sanitizeUser(user), accessToken, refreshToken };
};
