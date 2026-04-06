import { TokenService } from "./token.service";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();

  if (
    token &&
    !config.url?.includes("login") &&
    !config.url?.includes("register") &&
    !config.url?.includes("forgot-password") &&
    !config.url?.includes("reset-password")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default api;
