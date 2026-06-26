import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  loginUser,
  signupUser,
  refreshUserToken,
  logoutUser,
  getCurrentUser as fetchCurrentUser,
  demoLoginUser,
} from "../services/authService.js";
import {
  AuthenticatedRequest,
} from "../middleware/authMiddleware.js";
import { UserRole } from "../models/User.js";

const accessTokenExpirySeconds = () =>
  Number(process.env.ACCESS_TOKEN_EXPIRESIN) || 900;

const refreshTokenExpirySeconds = () =>
  Number(process.env.REFRESH_TOKEN_EXPIRESIN) || 604800;

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? ("none" as const) : ("lax" as const);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite,
    secure: isProduction,
    maxAge: accessTokenExpirySeconds() * 1000,
    path: "/",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite,
    secure: isProduction,
    maxAge: refreshTokenExpirySeconds() * 1000,
    path: "/",
  });
};

const clearAuthCookies = (res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? ("none" as const) : ("lax" as const);

  res.clearCookie("accessToken", {
    path: "/",
    httpOnly: true,
    sameSite,
    secure: isProduction,
  });
  res.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    sameSite,
    secure: isProduction,
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(email, password);
    setAuthCookies(res, accessToken, refreshToken);
    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, username, email, password, role, ...extra } = req.body;
    const displayName = name || username;
    const { user, accessToken, refreshToken } = await signupUser(
      displayName,
      username,
      email,
      password,
      (role as UserRole) || "customer",
      extra,
    );
    setAuthCookies(res, accessToken, refreshToken);
    return res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const { user, accessToken, refreshToken } = await refreshUserToken(oldRefreshToken);
    setAuthCookies(res, accessToken, refreshToken);
    return res.status(200).json({
      message: "Token refreshed successfully",
      user,
    });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      clearAuthCookies(res);
      return res
        .status(401)
        .json({ message: "Session expired, please log in again" });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      clearAuthCookies(res);
      return res.status(403).json({ message: "Invalid or tampered token" });
    }

    return next(err);
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    await logoutUser(refreshTokenCookie);
    clearAuthCookies(res);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await fetchCurrentUser(req.user.userId);
    return res.status(200).json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      clearAuthCookies(res);
    }
    return next(error);
  }
};

export const demoLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requestedRole = (req.body?.role || req.query.role || "customer") as UserRole;
    const { user, accessToken, refreshToken } = await demoLoginUser(requestedRole);
    setAuthCookies(res, accessToken, refreshToken);
    return res.status(200).json({
      message: `Demo login as ${requestedRole} successful`,
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDemoStatus = (_req: Request, res: Response) => {
  const val = process.env.ENABLE_DEMO_LOGIN?.trim().toLowerCase();
  const enabled = val === "true" || val === "1" || val === "yes";
  return res.status(200).json({ enabled });
};
