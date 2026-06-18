import api from "./api";

export interface DemoStatusResponse {
  enabled: boolean;
}

export const getDemoStatus = async (): Promise<boolean> => {
  try {
    const res = await api.get<DemoStatusResponse>("/auth/demo-status");
    if (res.data && typeof res.data === "object" && "enabled" in res.data) {
      return Boolean(res.data.enabled);
    }
    return false;
  } catch {
    return false;
  }
};
