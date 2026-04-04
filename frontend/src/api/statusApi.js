import apiClient from "./axios";

export const getFirebaseStatus = async () => {
  try {
    const res = await apiClient.get("/health/firebase");
    return {
      connected: Boolean(res.data?.connected),
      message: res.data?.message || "Unknown"
    };
  } catch {
    return {
      connected: false,
      message: "Backend unavailable"
    };
  }
};
