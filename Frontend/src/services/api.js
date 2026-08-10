import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const UPLOAD_BASE = import.meta.env.VITE_UPLOAD_URL || "http://localhost:5000";

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

export function getUploadBaseUrl() {
  return UPLOAD_BASE;
}

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = authToken || sessionStorage.getItem("cookcraft_jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
