import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 👉 ดึง token
const getToken = (): string | undefined => {
  return cookies.get("token");
};

// 👉 เก็บ token
const setToken = (token: string): void => {
  cookies.set("token", token, {
    path: "/",
    expires: new Date(Date.now() + 86400000), // 1 วัน
  });
};

// 👉 ลบ token (logout)
const removeToken = (): void => {
  cookies.remove("token", { path: "/" });
};

export const TokenService = {
 getAccessToken: getToken,
  setToken,
  removeToken,
};
