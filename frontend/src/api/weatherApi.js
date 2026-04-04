import apiClient from "./axios";

const BASE_URL = "/weather";

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const res = await apiClient.get(BASE_URL, {
      params: { latitude: lat, longitude: lon }
    });

    return res.data?.weather || {
      temperature: 28,
      humidity: 65,
      weatherCondition: "Clear",
      windSpeed: 5
    };
  } catch {
    // Fallback weather data when API is unavailable
    return {
      temperature: 28,
      humidity: 65,
      location: "Unknown Location",
      weatherCondition: "Clear",
      windSpeed: 5
    };
  }
};

export const getLocationDetailsByCoords = async (lat, lon) => {
  try {
    const res = await apiClient.get(`${BASE_URL}/location`, {
      params: { latitude: lat, longitude: lon }
    });

    return res.data?.location || {
      village: "Unknown",
      district: "Unknown",
      state: "Unknown",
      country: "Unknown"
    };
  } catch {
    return {
      village: "Unknown",
      district: "Unknown",
      state: "Unknown",
      country: "Unknown",
      postcode: "N/A",
      displayName: "Unable to fetch location details"
    };
  }
};