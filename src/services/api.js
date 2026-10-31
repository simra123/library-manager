import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

const publicEndpoints = new Set([
  "/auth/admi/login",
  "/auth/student/login",
]);

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token && !publicEndpoints.has(config.url || "")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  },
);

export default api;
