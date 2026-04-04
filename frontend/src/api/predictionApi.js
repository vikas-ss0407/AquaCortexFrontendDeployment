import axios from "axios";
import apiClient from "./axios";
import { getWeatherByCoords } from "./weatherApi";

const BASE_URL = "/prediction";
const THINGSPEAK_BASE = "https://api.thingspeak.com/channels";

const fetchThingSpeakData = async (channelId, field, readApiKey) => {
  try {
    const res = await axios.get(
      `${THINGSPEAK_BASE}/${channelId}/fields/${field}/last.json`,
      {
        params: readApiKey ? { api_key: readApiKey } : undefined
      }
    );
    return Number(res.data[`field${field}`]) || 0;
  } catch {
    return 0;
  }
};

export const getPrediction = async (data) => {
  try {
    const res = await apiClient.post(BASE_URL, data);
    return res.data;
  } catch (error) {
    // If backend responded, show its message instead of masking it with local fallback.
    if (error?.response) {
      const message =
        error.response?.data?.message ||
        "Prediction request failed. Please verify hardware and irrigation inputs.";
      throw new Error(message);
    }

    // Fetch real-time data
    const currentWaterLevel = await fetchThingSpeakData(
      data.thingSpeakChannelId,
      data.thingSpeakField,
      data.thingSpeakReadApiKey
    );

    const weather = await getWeatherByCoords(data.latitude, data.longitude);

    const irrigationDate = new Date(data.irrigationStart);
    const now = new Date();
    const hoursUntilIrrigation = Math.max(
      0,
      (irrigationDate - now) / (1000 * 60 * 60)
    );

    // Calculate available water (current level in well)
    const wellVolumeCubicFt = data.wellDepth * data.wellWidth * data.wellWidth * Math.PI / 4;
    const currentWaterVolumeCubicFt = currentWaterLevel * data.wellWidth * data.wellWidth * Math.PI / 4;
    const availableWaterL = currentWaterVolumeCubicFt * 28.3168; // cubic ft to liters

    // Estimate evaporation based on temperature (simplified)
    const evaporationRateEstimate = weather.temperature > 30 ? 0.5 : weather.temperature > 25 ? 0.3 : 0.1;
    const evaporationLoss = evaporationRateEstimate * hoursUntilIrrigation;
    const leakageLoss = 0; // Assuming negligible leakage
    const totalLoss = evaporationLoss + leakageLoss;

    // Calculate required water
    const requiredWaterL = data.treeCount * data.litersPerTree;

    // Safety margin (10% of required)
    const safetyWaterL = requiredWaterL * 0.1;

    // Final usable water
    const finalUsableWaterL = Math.max(0, availableWaterL - totalLoss - safetyWaterL);

    const isSufficient = finalUsableWaterL >= requiredWaterL;

    return {
      isSufficient,
      currentWaterLevel,
      temperature: weather.temperature,
      humidity: weather.humidity,
      availableWaterL: Math.round(availableWaterL),
      requiredWaterL: Math.round(requiredWaterL),
      finalUsableWaterL: Math.round(finalUsableWaterL),
      safetyWaterL: Math.round(safetyWaterL),
      evaporationLoss: Math.round(evaporationLoss),
      leakageLoss: Math.round(leakageLoss),
      hoursUntilIrrigation: hoursUntilIrrigation.toFixed(1),
      message: isSufficient
        ? `Water is sufficient for ${data.treeCount} tree(s).`
        : "Water is not sufficient. Turn on bore motor.",
      irrigationStart: data.irrigationStart,
      treeCount: data.treeCount
    };
  }
};
