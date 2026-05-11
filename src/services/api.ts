import { TokenService } from "./token.service";
import axios from "axios";

import { store } from "../redux/store";
import { logout } from "../redux/auth/authReducer";

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // สั่งเคลียร์ State และ Cookie
      store.dispatch(logout());

      // หน่วงเวลา 1.5 วินาที
      setTimeout(() => {
        window.location.replace("/login");
      }, 1500);
    }

    return Promise.reject(error);
  },
);

export default api;
