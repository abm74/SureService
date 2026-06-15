import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

export const getCloudinarySignature = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!isCloudinaryConfigured()) {
      res.status(500).json({
        message:
          "Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the server environment.",
      });
      return;
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "sureservice/verifications";

    const customParams = req.body.paramsToSign || {};
    const paramsToSign: Record<string, any> = {
      timestamp,
      folder,
      ...customParams,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    res.status(200).json({
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Failed to generate Cloudinary signature",
    });
  }
};
