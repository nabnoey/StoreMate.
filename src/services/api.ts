
import { TokenService } from "./token.service"
import axios from "axios"


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken()


//เช็คว่า token มีอยู่ไหม และไม่ใช่ path login, register, forgot-password ถึงจะส่ง token ไป
  if (
    token &&
    !config.url?.includes("login") &&
    !config.url?.includes("register")&&
    !config.url?.includes("forgot-password") && !config.url?.includes("reset-password") // ไม่ต้องส่ง token ไปที่path forgot-password
  ) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
export default api

