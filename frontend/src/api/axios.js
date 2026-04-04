import axios from "axios";
import { getCurrentUserToken } from "../firebase/auth";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 4000
});

// Add auth token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getCurrentUserToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
