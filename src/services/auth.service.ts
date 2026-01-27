import api from "./api"
import type { RegisterDTO, LoginDTO } from "../types/user"
import type { AuthUser } from "../types/auth"
import { TokenService } from "./token.service"

// =========================
// 📌 Register
// =========================
export const registerService = async (data: RegisterDTO) => {
  const res = await api.post(
    `${import.meta.env.VITE_AUTH_API}/register`,
    data
  )

  return res.data
}

// =========================
// 📌 Login
// =========================
export const loginService = async (data: LoginDTO) => {
  const res = await api.post<AuthUser>(
    `${import.meta.env.VITE_AUTH_API}/login`,
    data
  )

  // ✅ เช็คว่าเก็บ cookie หรือยัง
  if (res.status === 200 && res.data?.token) {
    TokenService.setUser(res.data)
  }

  return res.data
}
