import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Create axios instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Modify response data if needed
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle global error codes here (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("access_token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
