import axios from "axios";
import { getErrorMessage } from "../utils/helpers";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9000",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const isProtectedAppRoute = () => {
  const publicPaths = ["/", "/about", "/login", "/signup"];
  return !publicPaths.includes(window.location.pathname);
};
const isAuthEndpoint = (url: string | undefined) => {
  const authRoutes = ["/auth/login", "/auth/signup", "/auth/refresh", "/auth/logout"];
  return authRoutes.some((route) => url?.includes(route));
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    if (!originalRequest || originalRequest.url === "/auth/refresh" || isAuthEndpoint(originalRequest.url)) {
      if (error && typeof error === "object") {
        error.message = getErrorMessage(error);
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (isProtectedAppRoute()) {
          window.location.href = "/login";
        }
        if (refreshError && typeof refreshError === "object" && "message" in refreshError) {
          (refreshError as { message: string }).message = getErrorMessage(refreshError);
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error && typeof error === "object") {
      error.message = getErrorMessage(error);
    }
    return Promise.reject(error);
  },
);

export default api;
