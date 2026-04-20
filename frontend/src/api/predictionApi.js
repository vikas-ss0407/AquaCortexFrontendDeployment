import apiClient from "./axios";

const BASE_URL = "/prediction";

export const getPrediction = async (data) => {
  try {
    const res = await apiClient.post(BASE_URL, data);
    return res.data;
  } catch (error) {
    if (error?.response) {
      const message =
        error.response?.data?.message ||
        "Prediction request failed. Please verify hardware and irrigation inputs.";
      throw new Error(message);
    }
    throw new Error("Prediction service is unreachable. Please try again.");
  }
};
