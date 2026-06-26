import axios from "axios";
import api from "./api";

export interface CloudinarySignResponse {
  signature: string;
  timestamp: number;
  folder: string;
  cloudName: string;
  apiKey: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
  originalFilename?: string;
}

export const getUploadSignature = async (
  paramsToSign?: Record<string, unknown>
): Promise<CloudinarySignResponse> => {
  const response = await api.post<CloudinarySignResponse>("/upload/sign", {
    paramsToSign: paramsToSign || {},
  });
  return response.data;
};

export const uploadDirectToCloudinary = async (
  file: File,
  signData: CloudinarySignResponse,
  onProgress?: (percent: number) => void
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signData.apiKey);
  formData.append("timestamp", String(signData.timestamp));
  formData.append("signature", signData.signature);
  formData.append("folder", signData.folder);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  return {
    url: res.data.secure_url,
    publicId: res.data.public_id,
    format: res.data.format,
    bytes: res.data.bytes,
    originalFilename: res.data.original_filename,
  };
};
