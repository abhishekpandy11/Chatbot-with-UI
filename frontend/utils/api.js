import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh mechanism
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    // Handle network errors (err.response is undefined)
    if (!err.response) {
      return Promise.reject(err);
    }

    if (err.response.status === 401) {
      try {
        const refresh = Cookies.get("refresh_token");
        if (!refresh) {
          // No refresh token — redirect to login
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          window.location.href = "/login";
          return Promise.reject(err);
        }

        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refresh,
        });

        Cookies.set("access_token", res.data.access_token);
        err.config.headers.Authorization = `Bearer ${res.data.access_token}`;
        return axios(err.config);
      } catch (refreshError) {
        // Refresh failed — clear cookies and redirect to login
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
