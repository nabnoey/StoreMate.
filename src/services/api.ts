import { TokenService } from "./token.service";
import axios from "axios";

import { store } from "../redux/store";
import { logout } from "../redux/auth/authReducer";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();

  console.log("Token from TokenService:", token);
  console.log("Request URL:", config.url);

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // const isLoginAPI = error.config.url.includes("/login");
      // if (!isLoginAPI) {
      //   TokenService.removeToken();
      //   store.dispatch(logout());
      //   globalThis.location.href = "/login";
      // }
    }
    return Promise.reject(error);
  },
);

export default api;
