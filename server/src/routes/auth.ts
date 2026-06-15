import { Router } from "express";
import {
  login,
  signup,
  refreshToken,
  logout,
  getCurrentUser,
  demoLogin,
  getDemoStatus,
} from "../controllers/authController.js";
import { authenticateToken, optionalAuthenticateToken } from "../middleware/authMiddleware.js";
import {
  signupValidationRules,
  loginValidationRules,
  refreshTokenValidationRules,
  logoutValidationRules,
  validateAuthRequest,
} from "../validations/authValidation.js";

const authRouter = Router();

authRouter.get("/demo-status", getDemoStatus);
authRouter.post("/login", loginValidationRules, validateAuthRequest, login);
authRouter.post("/demo-login", demoLogin);
authRouter.post("/signup", signupValidationRules, validateAuthRequest, signup);
authRouter.post("/refresh", refreshTokenValidationRules, validateAuthRequest, refreshToken);
authRouter.post("/logout", optionalAuthenticateToken, logoutValidationRules, validateAuthRequest, logout);
authRouter.get("/me", authenticateToken, getCurrentUser);

export default authRouter;
