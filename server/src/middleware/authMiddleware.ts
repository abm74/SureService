import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/User.js";

export interface UserPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const tokenFromHeader = authHeader && authHeader.split(" ")[1];
  const tokenFromCookie = req.cookies?.accessToken;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    res.status(401).json({ message: "Access token missing or invalid" });
    return;
  }

  const secretKey = process.env.ACCESS_TOKEN_SECRET;
  if (!secretKey) {
    console.error("Critical: ACCESS_TOKEN_SECRET environment variable is missing.");
    res.status(500).json({ message: "Server configuration error: ACCESS_TOKEN_SECRET missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: `Forbidden: requires one of the following roles: [${allowedRoles.join(", ")}]`,
      });
      return;
    }

    next();
  };
};

export const optionalAuthenticateToken = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const tokenFromHeader = authHeader && authHeader.split(" ")[1];
  const tokenFromCookie = req.cookies?.accessToken;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    next();
    return;
  }

  const secretKey = process.env.ACCESS_TOKEN_SECRET;
  if (!secretKey) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey) as UserPayload;
    req.user = decoded;
  } catch {
    // Ignore invalid token in optional auth
  }

  next();
};
