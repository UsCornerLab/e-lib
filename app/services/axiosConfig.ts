// services/axiosConfig.ts
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

axios.defaults.baseURL = API_URL;

// Request interceptor to attach token from localStorage
axios.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          if (!config.headers) config.headers = {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // ignore
      console.warn("axios request interceptor failed:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 (optional automatic cleanup)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      // If token expired or unauthorized, clear local client state and send user to login.
      if (status === 401 || status === 419) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // optional: redirect to login page
          // Avoid loop if already on login
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
      }
    } catch (e) {
      console.warn("axios response interceptor failed:", e);
    }
    return Promise.reject(error);
  }
);

export default axios;
